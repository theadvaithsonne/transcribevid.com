import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A a texto',
  h1: 'Transcribir una nota de voz M4A a texto',
  lead: 'M4A es lo que guardan las Notas de voz del iPhone y del Mac, muchas grabadoras de Android y las aplicaciones de Apple. Añade el archivo y obtén una transcripción con marcas de tiempo, gratis, sin iniciar sesión y sin convertirlo a MP3.',
  dropKind: 'audio',
  dropNoun: 'archivo M4A',

  whyTitle: 'Por qué los archivos M4A se transcriben bien',
  why: [
    'Un M4A es un archivo MPEG-4 solo de audio. Suele contener sonido AAC, que está comprimido pero es más que suficiente para la voz, así que los archivos M4A son pequeños y se transcriben bien. TranscribeVid los lee directamente. No hay nada que convertir antes.',
    'Las notas de voz se hacen sobre la marcha, así que a menudo suenan bajas, con eco o grabadas con el teléfono en el bolsillo. Las opciones de calidad y de limpieza de esta página existen justo para ese tipo de grabación.',
  ],

  sections: [
    {
      title: 'Cómo sacar una nota de voz del teléfono',
      paragraphs: [
        'Los nombres de los menús cambian entre versiones de iOS, macOS y Android, así que tómalos como una guía. Si estás en el propio teléfono, pulsa Elegir un archivo y elige la grabación en Archivos o en tu carpeta de grabaciones. No hace falta una computadora.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'En Notas de voz, abre la grabación, toca el botón Más (tres puntos) y elige Compartir. Guárdala en Archivos, o envíatela por AirDrop o por correo, y luego añádela aquí.',
        },
        {
          title: 'Mac.',
          text: 'Arrastra una grabación desde la ventana de Notas de voz hasta el Escritorio. Llega como un archivo .m4a, lista para añadir.',
        },
        {
          title: 'Android.',
          text: 'Muchas aplicaciones de grabación guardan archivos M4A en una carpeta Recordings o Grabadora de voz. El nombre de la carpeta depende de la aplicación, y el selector de archivos puede abrirla.',
        },
      ],
    },
    {
      title: 'Notas de voz sin pérdida y comprimidas',
      paragraphs: [
        'Las Notas de voz del iPhone pueden guardar las grabaciones como Comprimidas o Sin pérdida. Los archivos sin pérdida son mucho más grandes, siguen terminando en .m4a y suelen usar el códec Apple Lossless. La voz no lo necesita: una nota Comprimida da la misma transcripción con una fracción del tamaño.',
      ],
      browser: {
        paragraphs: [
          'Las Notas de voz del iPhone pueden guardar las grabaciones como Comprimidas o Sin pérdida. Los archivos sin pérdida son mucho más grandes, siguen terminando en .m4a y suelen usar el códec Apple Lossless, que no todos los navegadores pueden leer por sí solos. Si el tuyo no puede, la página puede ofrecerte cargar un pequeño conversor (unos 9 MB) que se ejecuta en tu dispositivo. La voz no necesita Sin pérdida: una nota Comprimida da la misma transcripción con una fracción del tamaño.',
        ],
      },
    },
  ],

  howTitle: 'Cómo convertir un M4A en texto',
  howToDescription:
    'Añade el archivo M4A, elige el idioma hablado, espera la transcripción y descárgala como texto.',
  steps: [
    {
      title: 'Añade el M4A',
      text: 'Suelta la nota .m4a en el cuadro de la parte superior de esta página, o pulsa Elegir un archivo y, en un teléfono, elígela en Archivos o en tu carpeta de grabaciones. En este cuadro entra una sola nota; cuando estés en la página siguiente, Añadir otro archivo trae el resto.',
    },
    {
      title: 'Elige el idioma',
      text: 'En la página siguiente, selecciona el idioma hablado. Una nota corta le da poco material a Detectar automáticamente, así que indicar el idioma es más fiable. La calidad Estándar sirve para la mayoría de las notas. Después pulsa Transcribir.',
    },
    {
      title: 'Espera la transcripción',
      text: 'Las líneas aparecen una a una con una barra de progreso y una estimación del tiempo restante. Reproduce desde cualquier línea para oír lo que se dijo.',
    },
    {
      title: 'Corrige y guarda',
      text: 'Corrige cualquier palabra equivocada y descarga TXT, Markdown o PDF para notas, o SRT o VTT si la nota acompaña a un video. Una transcripción vive solo durante tu sesión, así que descárgala antes de cerrar la página.',
    },
  ],

  formatsTitle: 'M4A y otros formatos de audio',
  formatsIntro:
    'Las grabadoras de los teléfonos y de las computadoras guardan en formatos distintos. Este cuadro admite todos estos.',
  uploadTitle: 'Archivos de audio que puedes añadir',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'tus palabras como texto sin formato' },
    { name: 'Markdown', use: 'notas con tiempos' },
    { name: 'PDF', use: 'una copia de la nota para imprimir' },
    { name: 'SRT', use: 'líneas con tiempos para un video que acompaña a la nota' },
    { name: 'VTT', use: 'líneas con tiempos para reproductores web' },
    { name: 'JSON', use: 'líneas estructuradas para programas' },
  ],

  tipsTitle: 'Consejos para transcribir notas de voz',
  tips: [
    {
      title: 'Sostén el teléfono cerca.',
      text: 'Una nota grabada con el teléfono en el bolsillo o al otro lado de una mesa es difícil para cualquier reconocedor de voz. Sostén el teléfono a un palmo de la boca y habla de lado, no directamente hacia él.',
    },
    {
      title: 'Recorta antes de compartir.',
      text: 'La mayoría de las aplicaciones de notas de voz permiten cortar el principio y el final de una grabación. Quitar una pausa larga en cualquiera de los extremos ahorra tiempo de espera.',
    },
    {
      title: 'Indica el idioma.',
      text: 'En una nota de diez o veinte segundos, elegir el idioma hablado es mejor que la detección automática, sobre todo con acento o con una mezcla de idiomas.',
    },
    {
      title: 'Dale los nombres difíciles.',
      text: 'Añade los nombres poco habituales a la pista de vocabulario en Más opciones y será mucho más probable que salgan bien.',
    },
  ],

  faqs: [
    {
      question: '¿Puedo transcribir una Nota de voz del iPhone sin convertirla?',
      answer:
        'Sí. Las Notas de voz son archivos M4A y TranscribeVid lee M4A directamente. Comparte la nota a Archivos o a tu computadora y añádela aquí. No la conviertas antes a MP3.',
    },
    {
      question: '¿Un archivo M4A es lo mismo que un MP4?',
      answer:
        'Son parientes cercanos. Ambos usan el contenedor MPEG-4; un M4A guarda solo audio, mientras que un MP4 suele llevar también video. TranscribeVid lee el sonido de cualquiera de los dos.',
    },
    {
      question: '¿Por qué mi transcripción M4A sale vacía o muy corta?',
      answer:
        'La nota puede estar en silencio, muy baja o ser sobre todo ruido de fondo. Escúchala primero. Si suena débil, deja activado Mejorar el audio en Más opciones y comprueba que el archivo no se cortó al compartirlo.',
    },
    {
      question: '¿Puedo transcribir una reunión larga grabada con el teléfono?',
      answer:
        'Sí. Los archivos M4A son pequeños, así que una grabación larga es fácil de añadir. {limits} No hay cuota diaria ni mensual.',
      browser: {
        answer:
          'Sí. Los archivos M4A son pequeños, así que una grabación larga es fácil de añadir. El sitio no pone límite de tamaño ni de duración porque tu propio dispositivo hace el trabajo, así que una nota muy larga simplemente tarda más, y en un dispositivo lento la página lo avisa antes de empezar. Un navegador antiguo puede rechazar un archivo muy largo.',
      },
    },
    {
      question: '¿Puedo transcribir una nota de voz en hindi o en español?',
      answer:
        'Sí. Elige el idioma hablado en la lista de más de 50, o deja activada Detectar automáticamente si la nota está en un solo idioma. Para el hindi, Estilo de la transcripción (junto a Idioma) te permite elegir letras latinas (hinglish) o la escritura original, el devanagari.',
    },
  ],

  links: [
    {
      label: 'Grabación de voz a texto',
      path: '/voice-recording-to-text',
      note: 'Graba con tu micrófono en la propia página en lugar de subir un archivo.',
    },
    {
      label: 'MP3 a texto',
      path: '/mp3-to-text',
      note: 'La misma transcripción gratuita para archivos MP3, el otro formato de voz habitual.',
    },
    {
      label: 'Clase a texto',
      path: '/lecture-to-text',
      note: 'Convierte una clase grabada en apuntes que puedes buscar y estudiar.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Cambios sencillos en la grabación y en los ajustes que marcan la mayor diferencia.',
    },
  ],
};
