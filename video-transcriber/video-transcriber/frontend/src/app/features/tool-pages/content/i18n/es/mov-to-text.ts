import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV a texto',
  h1: 'Transcribir un video MOV a texto',
  lead: 'MOV es lo que graban los iPhone, los Mac y muchas cámaras. Añade tu MOV y obtén una transcripción con marcas de tiempo, gratis y sin iniciar sesión. Solo se lee el sonido, así que el tamaño y el códec de la imagen no importan.',
  dropKind: 'video',
  dropNoun: 'archivo MOV',

  whyTitle: 'Por qué los archivos MOV no necesitan conversión',
  why: [
    'MOV es el formato QuickTime de Apple. Igual que un MP4, guarda juntos la imagen y el sonido, y la mayoría de los archivos MOV llevan sonido AAC que se lee directamente. TranscribeVid lee ese sonido e ignora la imagen, así que no hace falta un paso aparte de MOV a MP4.',
    'Los archivos MOV suelen ser grandes, porque los teléfonos y las cámaras graban con alta calidad. No tienes que reducir ni convertir el tuyo. El camino más rápido del carrete a una transcripción es añadir el archivo tal como está.',
  ],

  sections: [
    {
      title: 'De dónde vienen los archivos MOV',
      bullets: [
        {
          title: 'Videos de iPhone y iPad.',
          text: 'Los videos grabados con la aplicación Cámara se guardan como archivos .MOV, tanto si el formato de imagen es H.264 como si es HEVC.',
        },
        {
          title: 'Grabaciones de pantalla del Mac.',
          text: 'La barra de herramientas de capturas (Mayús-Comando-5) y QuickTime Player guardan las grabaciones de pantalla como .mov. Elige un micrófono antes de grabar o el archivo no tendrá voz.',
        },
        {
          title: 'Cámaras y software de edición.',
          text: 'Muchas cámaras sin espejo graban en MOV, y editores de video como Final Cut Pro y Adobe Premiere Pro pueden exportarlo.',
        },
      ],
    },
    {
      title: 'Cómo sacar un video del iPhone',
      paragraphs: [
        'Lo más sencillo es abrir esta página en el propio iPhone y pulsar Elegir un archivo. Puedes elegir un video de la biblioteca de Fotos o de Archivos. Si el teléfono pregunta qué formato usar al elegirlo, vale cualquier respuesta, porque solo se lee el sonido.',
        'Para transcribir en una computadora, envía el video por AirDrop, guárdalo en Archivos o en iCloud Drive, o cópialo con un cable. Los nombres de los menús cambian entre versiones de iOS y macOS, así que tómalos como una guía.',
      ],
    },
    {
      title: 'Videos con más de una pista de audio',
      paragraphs: [
        'Algunas cámaras y editores escriben varias pistas de audio en un mismo MOV, por ejemplo un micrófono de cámara y un micrófono de solapa. TranscribeVid usa la primera pista de audio que puede leer. Si la voz que quieres está en otra pista, exporta antes una copia con esa pista, o mezcla las pistas en tu editor.',
      ],
    },
  ],

  howTitle: 'Cómo convertir un MOV a texto',
  howToDescription:
    'Añade el video MOV, elige el idioma hablado y la calidad, espera la transcripción y descárgala.',
  steps: [
    {
      title: 'Añade el MOV',
      text: 'Pulsa Elegir un archivo en la parte superior de esta página o suelta el .mov en el cuadro. Un iPhone ofrece Fotos y Archivos. En este cuadro cabe un video cada vez; Añadir otro archivo, en la página siguiente, pone en cola más.',
    },
    {
      title: 'Ajusta idioma y calidad',
      text: 'En la página siguiente, elige el idioma hablado. Se recomienda Estándar. Con viento, tráfico o una persona que habla lejos, Alta precisión y Máxima precisión tardan más y cometen menos errores. Después pulsa Transcribir.',
      browser: {
        text: 'En la página siguiente, elige el idioma hablado. Se recomienda Estándar. Con viento, tráfico o una persona que habla lejos, prueba Alta precisión o Máxima precisión si tu dispositivo las ofrece: tardan más y cometen menos errores, cada una es una descarga inicial más grande, y un dispositivo que no puede ejecutar una la muestra atenuada con el motivo. Después pulsa Transcribir.',
      },
    },
    {
      title: 'Lee y corrige',
      text: 'El texto llega línea por línea con una hora en cada una. Reproduce desde cualquier línea, corrige lo que esté mal y elimina las líneas que no quieras.',
    },
    {
      title: 'Descarga la transcripción',
      text: 'Obtén TXT o un PDF para leer, o SRT o VTT para usar como subtítulos en un editor de video o en la web. Tu MOV nunca se modifica.',
    },
  ],

  formatsTitle: 'MOV y otros formatos de video',
  formatsIntro:
    'El mismo cuadro admite MOV y estos otros tipos, y también los formatos de audio de siempre.',
  uploadTitle: 'Archivos de video que puedes añadir',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'las palabras habladas como texto sin formato' },
    { name: 'SRT', use: 'subtítulos para editores y reproductores' },
    { name: 'VTT', use: 'subtítulos para una página web' },
    { name: 'PDF', use: 'una transcripción para imprimir o compartir' },
    { name: 'Markdown', use: 'notas con tiempos' },
    { name: 'JSON', use: 'datos para tus propias herramientas' },
  ],

  tipsTitle: 'Consejos para transcribir videos MOV',
  tips: [
    {
      title: 'Deja activado Mejorar el audio.',
      text: 'Los videos del teléfono recogen viento, ruido de manipulación y eco de la sala. El interruptor Mejorar el audio de Más opciones elimina los ruidos graves y el siseo y realza las voces bajas.',
    },
    {
      title: 'Comprueba qué pista tiene la voz.',
      text: 'Si una cámara grabó dos micrófonos como pistas separadas, reproduce el video y asegúrate de que la primera pista es la que tiene la voz.',
    },
    {
      title: 'Corta las grabaciones largas en pausas naturales.',
      text: 'Los archivos que superan el límite de tamaño o de duración se rechazan. Divide el video en partes, o exporta solo su audio, y luego añádelo.',
      browser: {
        title: 'Las grabaciones largas necesitan memoria.',
        text: 'El sitio no pone límite de tamaño ni de duración, pero un video largo necesita tiempo y memoria libre, sobre todo en un teléfono, y un navegador antiguo puede rechazar un archivo muy largo. Para una grabación muy larga, exporta solo el audio desde tu editor o divide el video en partes.',
      },
    },
    {
      title: 'Graba con sonido a propósito.',
      text: 'Una grabación de pantalla del Mac hecha sin micrófono no tiene voz, y la transcripción sale vacía.',
    },
  ],

  faqs: [
    {
      question: '¿Puedo transcribir un video del iPhone sin convertir MOV a MP4?',
      answer:
        'Sí. Añade el MOV tal como está. TranscribeVid lee la pista de sonido e ignora la imagen, así que no hace falta ninguna conversión.',
    },
    {
      question: '¿Funciona un video 4K o HEVC de mi iPhone?',
      answer:
        'Sí. Solo se usa el sonido, así que el tamaño de la imagen y el formato de video no importan. Lo que cuenta es la pista de sonido, y las grabaciones del iPhone y del Mac usan sonido AAC, que se lee directamente.',
    },
    {
      question: '¿Cómo paso un video del iPhone a una computadora para transcribirlo?',
      answer:
        'Envíalo por AirDrop a un Mac, guárdalo en Archivos o en iCloud Drive, o cópialo con un cable. O sáltate la computadora: abre esta página en el iPhone y elige el video desde Fotos.',
    },
    {
      question: '¿Por qué mi grabación de pantalla del Mac no tiene texto?',
      answer:
        'Una grabación de pantalla solo lleva sonido si se eligió un micrófono antes de grabar. En la barra de herramientas de Mayús-Comando-5, abre Opciones, elige un micrófono y vuelve a grabar. Los nombres de los menús pueden variar entre versiones de macOS.',
    },
    {
      question: '¿Qué pasa si mi MOV tiene dos pistas de audio?',
      answer:
        'TranscribeVid usa la primera pista de audio que puede leer. Si la voz está en otra pista, exporta antes una copia con esa pista, o mezcla las pistas en tu editor.',
    },
  ],

  links: [
    {
      label: 'MP4 a texto',
      path: '/mp4-to-text',
      note: 'El mismo servicio para archivos MP4, el otro formato de video habitual en los teléfonos.',
    },
    {
      label: 'Video a texto',
      path: '/video-to-text',
      note: 'La página principal para cualquier archivo de video, con consejos para clases, entrevistas y clips.',
    },
    {
      label: 'Generador de subtítulos SRT',
      path: '/srt-subtitle-generator',
      note: 'Crea subtítulos para tu MOV y mira cómo es por dentro un archivo SRT.',
    },
    {
      label: 'Cómo añadir subtítulos a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Qué hacer con el archivo de subtítulos una vez descargado.',
    },
  ],
};
