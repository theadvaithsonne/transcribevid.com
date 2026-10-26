import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Generador de subtítulos para YouTube',
  h1: 'Crea subtítulos para tu propio video de YouTube',
  lead: 'Añade el archivo de video que hiciste para YouTube, obtén un archivo SRT sincronizado con la voz y súbelo en YouTube Studio. Gratis, sin iniciar sesión, y revisas cada línea antes de publicar.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Por qué subir tu propio archivo de subtítulos',
  why: [
    'YouTube genera subtítulos automáticos para muchos videos, pero no siempre son correctos, y no aparecen hasta que YouTube termina de procesar el video. Un archivo de subtítulos propio te permite revisar y corregir cada línea, con tus nombres, productos y términos escritos como tú los escribes.',
    'Esta página es para videos que hiciste tú. Trabaja a partir del archivo de video de tu computadora, no de un enlace de YouTube: no se admite pegar un enlace. Si el video es tuyo, ya tienes el original de tu cámara o de tu editor. TranscribeVid es una herramienta independiente y no está vinculada a YouTube: nunca inicia sesión en tu canal, así que el archivo terminado lo añades tú allí.',
  ],

  sections: [
    {
      title: 'Añadir el archivo SRT en YouTube Studio',
      paragraphs: [
        'Los nombres de los menús de YouTube Studio cambian de vez en cuando, así que toma estos pasos como una guía y sigue las etiquetas que veas en pantalla.',
      ],
      bullets: [
        {
          title: 'Abre Subtítulos.',
          text: 'Inicia sesión en tu canal, abre YouTube Studio y elige Subtítulos en el menú de la izquierda.',
        },
        {
          title: 'Elige el video.',
          text: 'Elige el video al que quieres poner subtítulos. Si YouTube te pide el idioma del video, indícalo primero.',
        },
        {
          title: 'Añade el idioma.',
          text: 'Elige Añadir idioma, selecciona el idioma del archivo y luego elige Añadir en Subtítulos.',
        },
        {
          title: 'Sube el archivo.',
          text: 'Elige Subir archivo, luego Con sincronización, y selecciona el archivo .srt que descargaste. Revisa las líneas en la vista previa y después elige Publicar.',
        },
      ],
    },
    {
      title: 'Subtítulos en inglés a partir de otro idioma',
      paragraphs: [
        'Si el video se habla en otro idioma, pon Salida en Traducir al inglés en Más opciones antes de empezar. Obtienes texto en inglés sincronizado con la voz, que puedes subir como pista de subtítulos en inglés. La traducción es un trabajo automático, así que lee el inglés completo antes de publicarlo.',
        'TranscribeVid no traduce a idiomas distintos del inglés. Para cada otro idioma del que tengas un archivo, añade una pista aparte en YouTube Studio.',
      ],
    },
    {
      title: 'Por qué merece la pena poner subtítulos',
      paragraphs: [
        'La gente ve videos en lugares donde no puede subir el sonido, y muchas personas siguen mejor un segundo idioma por escrito que de oído. Los subtítulos también ayudan a quienes son sordos o tienen dificultades auditivas, y convierten tus palabras habladas en texto en el que se puede buscar y que se puede citar.',
      ],
    },
  ],

  howTitle: 'Cómo hacer subtítulos para un video de YouTube',
  howToDescription:
    'Añade el archivo de video, elige el idioma hablado, revisa las líneas, descarga un archivo SRT y súbelo en YouTube Studio.',
  steps: [
    {
      title: 'Añade tu archivo de video',
      text: 'Elige el archivo de video que subiste a YouTube, no un enlace a él: suéltalo en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. Para un segundo video, usa Añadir otro archivo en la página siguiente.',
    },
    {
      title: 'Elige el idioma',
      text: 'En la página siguiente, elige el idioma hablado o deja activado Detectar automáticamente. Mantén activado Tiempos por palabra en Más opciones, para que cada línea empiece y termine con las palabras. Después pulsa Transcribir.',
    },
    {
      title: 'Revisa las líneas',
      text: 'Abre la transcripción, reproduce desde cualquier marca de tiempo y corrige las palabras, los nombres y los números equivocados. Borra las líneas que no quieras que se muestren.',
    },
    {
      title: 'Descarga el SRT y súbelo',
      text: 'Descarga el archivo SRT y añádelo al video en YouTube Studio como se describe arriba.',
    },
  ],

  formatsTitle: 'Archivos de video y archivos de subtítulos',
  formatsIntro:
    'Añade el archivo de video que hiciste para YouTube, en cualquiera de estos tipos, y descarga los subtítulos en el formato que necesites.',
  uploadTitle: 'Archivos de video que puedes añadir',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'el archivo de subtítulos que pide YouTube Studio' },
    { name: 'VTT', use: 'WebVTT, para reproductores web' },
    { name: 'TXT', use: 'una transcripción para tu descripción o para una entrada de blog' },
    { name: 'Markdown', use: 'texto con marcas de tiempo' },
    { name: 'JSON', use: 'cada línea y cada tiempo, para programas' },
    { name: 'PDF', use: 'un guion imprimible' },
  ],

  tipsTitle: 'Consejos para subtítulos de YouTube',
  tips: [
    {
      title: 'Usa el montaje final.',
      text: 'Haz el archivo a partir del video exacto que subes, no de un borrador anterior. Cada edición que mueve la voz también mueve los tiempos.',
    },
    {
      title: 'Mantén activados los tiempos por palabra.',
      text: 'Está activado de forma predeterminada y da una sincronización de subtítulos más ajustada que la de frases completas.',
    },
    {
      title: 'Corrige los nombres antes de publicar.',
      text: 'El texto automático se equivoca sobre todo con nombres de canales, productos y números. Una pista de vocabulario ayuda, y una lectura completa detecta el resto.',
    },
    {
      title: 'Léelo con el sonido apagado.',
      text: 'Mira el video en silencio con los subtítulos activados. Verás enseguida qué líneas desaparecen demasiado rápido para leerlas.',
    },
  ],

  faqs: [
    {
      question: '¿Puedo hacer subtítulos para un video de YouTube que no subí yo?',
      answer:
        'No. Esta herramienta trabaja solo con archivos, no con enlaces, y está pensada para videos que hiciste o que tienes derecho a usar. Para tus propios videos, usa el archivo original de tu cámara o de tu editor.',
    },
    {
      question: '¿Qué archivo quiere YouTube Studio, SRT o VTT?',
      answer:
        'SRT es la opción más segura: es un formato muy usado que YouTube Studio lee. Súbelo con sincronización, para que las líneas coincidan con la voz.',
    },
    {
      question: '¿Necesito iniciar sesión para hacer el archivo de subtítulos?',
      answer:
        'No. Aquí no necesitas ninguna cuenta. Solo necesitas tu canal de YouTube para subir el archivo en YouTube Studio.',
    },
    {
      question: '¿Cómo consigo subtítulos en inglés para un video en español o en hindi?',
      answer:
        'Pon Salida en Traducir al inglés en Más opciones antes de empezar. La transcripción sale en inglés con tiempos. La traducción es automática y puede contener errores, así que léela antes de publicarla como pista en inglés.',
    },
    {
      question: '¿Por qué mis subtítulos están desfasados en YouTube?',
      answer:
        'Lo más habitual es que el archivo se haya hecho a partir de otra versión del video, por ejemplo antes de recortar el principio. Vuelve a hacer el archivo a partir del video exacto que subiste. Los tiempos son aproximados, pero no exactos al fotograma, así que una comprobación final en YouTube Studio ayuda.',
    },
  ],

  links: [
    {
      label: 'Generador de subtítulos SRT',
      path: '/srt-subtitle-generator',
      note: 'Cómo es un archivo SRT por dentro y cómo corregir líneas antes de exportar.',
    },
    {
      label: 'Cómo añadir subtítulos a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Otros lugares donde usar el archivo: reproductores, editores y tu propia página web.',
    },
    {
      label: 'Traducir audio al inglés',
      path: '/translate-audio-to-english',
      note: 'Texto en inglés a partir de voz en otro idioma, y qué comprobar después.',
    },
    {
      label: 'SRT frente a VTT: qué formato de subtítulos usar',
      path: '/guides/srt-vs-vtt',
      note: 'En qué se diferencian los dos formatos de subtítulos más habituales.',
    },
  ],
};
