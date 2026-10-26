import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM a texto',
  h1: 'Transcribir una grabación WebM a texto',
  lead: 'WebM es el formato que guardan los navegadores y los grabadores de pantalla. Añade tu video o audio WebM y obtén una transcripción con marcas de tiempo, gratis, sin iniciar sesión y sin conversión previa.',
  dropKind: 'video',
  dropNoun: 'archivo WebM',

  whyTitle: 'Qué hay dentro de un archivo WebM',
  why: [
    'WebM es un contenedor pensado para la web. Suele guardar video VP8, VP9 o AV1 con sonido Opus o Vorbis. TranscribeVid lee solo el sonido, así que da igual qué códec de video haya dentro, y un WebM que contenga solo audio funciona igual de bien.',
    'Opus, el formato de sonido que usan la mayoría de los archivos WebM, se diseñó para la voz, lo que convierte estas grabaciones en una buena fuente para una transcripción. El resultado es texto con la hora en cada línea, listo para buscar, citar o convertir en subtítulos.',
  ],

  sections: [
    {
      title: 'De dónde vienen los archivos WebM',
      paragraphs: [
        'La mayoría de los archivos WebM los crea el propio navegador, y por eso aparecen siempre que alguien graba algo en línea.',
      ],
      bullets: [
        {
          title: 'Grabadores de pantalla y de navegador.',
          text: 'Muchas extensiones de grabación de pantalla y grabadores web guardan en WebM, porque es el formato que un navegador puede grabar directamente.',
        },
        {
          title: 'Grabadoras de voz en línea.',
          text: 'Un sitio web que graba tu micrófono suele darte un archivo de audio .webm. Puede parecer un archivo de video, pero contiene solo sonido.',
        },
        {
          title: 'Aplicaciones web que creas o pruebas.',
          text: 'Las páginas que graban con la función MediaRecorder del navegador suelen producir WebM en Chrome. Firefox hace lo mismo con el video, pero sus grabaciones solo de sonido suelen ser Ogg, que esta página también lee.',
        },
      ],
    },
    {
      title: 'Una peculiaridad de los WebM grabados',
      paragraphs: [
        'Un WebM grabado en directo en el navegador suele no tener escrita la duración total en el archivo. Algunos reproductores muestran entonces una duración desconocida o no permiten saltar hacia delante, y puede parecer un archivo dañado. El sonido en sí está intacto, y la transcripción se hace a partir de él con normalidad.',
        'Si una grabación falla de verdad, la causa suele ser más sencilla: el micrófono estaba apagado, así que no hay voz en ella. Reproduce el archivo con el volumen alto antes de buscar otra razón.',
      ],
    },
  ],

  howTitle: 'Cómo convertir un WebM a texto',
  howToDescription:
    'Añade el archivo WebM, elige el idioma hablado, revisa las líneas y descarga la transcripción como texto o como subtítulos WebVTT.',
  steps: [
    {
      title: 'Añade el WebM',
      text: 'Suelta el .webm en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. Un WebM que contiene solo sonido entra de la misma manera. Para varias grabaciones, añade la primera aquí y las demás con Añadir otro archivo en la página siguiente.',
    },
    {
      title: 'Elige el idioma',
      text: 'En la página siguiente, elige el idioma hablado, o deja Detectar automáticamente si la grabación está en un solo idioma. La calidad Estándar sirve para voces claras con un buen micrófono. Después pulsa Transcribir.',
    },
    {
      title: 'Revisa las líneas',
      text: 'Mira cómo llega el texto línea por línea. Abre la transcripción, reproduce desde cualquier marca de tiempo y corrige las palabras que estén mal.',
    },
    {
      title: 'Descarga el resultado',
      text: 'Obtén TXT para leer o buscar. Un WebM es para la web, así que VTT es el archivo de subtítulos natural para él. SRT y PDF también están disponibles.',
    },
  ],

  formatsTitle: 'WebM y otros formatos de video',
  formatsIntro: 'WebM es uno de los muchos tipos de video y audio que admite este cuadro.',
  uploadTitle: 'Archivos que puedes añadir',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'las palabras habladas como texto sin formato' },
    { name: 'VTT', use: 'subtítulos para el mismo WebM en una página web' },
    { name: 'SRT', use: 'subtítulos para reproductores y editores' },
    { name: 'Markdown', use: 'notas con tiempos' },
    { name: 'JSON', use: 'cada línea y su tiempo, para programas' },
    { name: 'PDF', use: 'una transcripción para imprimir o compartir' },
  ],

  tipsTitle: 'Consejos para transcribir grabaciones WebM',
  tips: [
    {
      title: 'Enciende el micrófono antes de grabar.',
      text: 'Los grabadores de pantalla suelen capturar solo la imagen a menos que marques la opción del micrófono o del audio del sistema. Sin sonido no hay nada que transcribir.',
    },
    {
      title: 'Espera una sola pista de voz.',
      text: 'Si grabaste una pestaña de reunión junto con tu propio micrófono, todos acaban en la misma pista. No hay etiquetas de hablantes, así que añade los nombres mientras editas.',
    },
    {
      title: 'Usa VTT para la web.',
      text: 'El elemento video de un navegador lee los subtítulos VTT mediante el elemento track. No lee SRT, así que elige VTT para un WebM en tu propia página.',
    },
    {
      title: 'Corta las grabaciones muy largas.',
      text: 'Los archivos que superan el límite de tamaño o de duración se rechazan, así que corta antes un WebM largo en partes.',
      browser: {
        title: 'Las grabaciones largas tardan más.',
        text: 'El sitio no pone límite de tamaño ni de duración. Una captura de pantalla larga igualmente necesita tiempo y memoria libre, y un navegador antiguo puede rechazar un archivo muy largo, así que en un teléfono córtalo antes en partes.',
      },
    },
    {
      title: 'Anota nombres y comandos.',
      text: 'En una demostración de software, escribe nombres de producto, comandos y siglas en la pista de vocabulario para que salgan escritos como tú los escribes.',
    },
  ],

  faqs: [
    {
      question:
        '¿Por qué no puedo reproducir mi WebM en el teléfono, y aun así puedo transcribirlo?',
      answer:
        'Algunos teléfonos y reproductores antiguos no pueden abrir WebM. Aquí no importa: TranscribeVid solo necesita el sonido, así que puedes añadir el archivo igualmente y obtener una transcripción.',
    },
    {
      question: '¿Puedo transcribir un WebM que solo tiene audio?',
      answer:
        'Sí. Algunas grabadoras guardan archivos solo de sonido con la extensión .webm. Se leen como cualquier otro archivo de audio.',
    },
    {
      question: '¿Importa si mi WebM usa VP8, VP9 o AV1?',
      answer:
        'No. La imagen se ignora. Lo que importa es que el archivo tenga una pista de sonido en un formato habitual como Opus.',
    },
    {
      question: '¿Cómo uso los subtítulos con un WebM en mi propia página web?',
      answer:
        'Descarga el archivo VTT, guárdalo junto al video y apunta a él con un elemento track dentro del elemento video. La página del generador de subtítulos VTT muestra cómo es el archivo y el código exacto.',
    },
    {
      question: '¿Por qué mi grabación de pantalla dio una transcripción vacía?',
      answer:
        'Lo más probable es que no contenga voz: el micrófono estaba apagado o solo se grabaron sonidos del sistema. Si oyes hablar a la gente pero no obtienes texto, deja activado Mejorar el audio en Más opciones y prueba un ajuste de calidad más alto.',
    },
  ],

  links: [
    {
      label: 'Generador de subtítulos VTT',
      path: '/vtt-subtitle-generator',
      note: 'Qué contiene un archivo WebVTT y cómo asociarlo a un video en tu propia página.',
    },
    {
      label: 'Cómo añadir subtítulos a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Todo el recorrido desde la grabación hasta los subtítulos publicados, paso a paso.',
    },
    {
      label: 'Grabación de reunión a texto',
      path: '/meeting-recording-to-text',
      note: 'Para llamadas y seminarios web grabados, incluido cómo sacar la grabación de la herramienta de reuniones.',
    },
    {
      label: 'MP4 a texto',
      path: '/mp4-to-text',
      note: 'El mismo servicio para MP4, el formato de video más habitual.',
    },
  ],
};
