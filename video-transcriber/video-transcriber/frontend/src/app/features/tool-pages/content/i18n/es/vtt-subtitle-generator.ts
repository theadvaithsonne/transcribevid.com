import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Generador de subtítulos VTT',
  h1: 'Genera un archivo de subtítulos WebVTT (.vtt) a partir de un video',
  lead: 'Añade un archivo de video o de audio y descarga un archivo de subtítulos WebVTT sincronizado con la voz. Gratis, sin iniciar sesión, y puedes corregir las líneas antes de exportar. Úsalo con el elemento de video de HTML5 o con cualquier reproductor web.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Qué es WebVTT y por qué lo usa la web',
  why: [
    'WebVTT (.vtt) es el formato de subtítulos de la web. Es un archivo de texto plano que los navegadores entienden de forma nativa: apunta el elemento track de un video a un archivo .vtt y aparecen los subtítulos, sin complementos ni scripts.',
    'Se parece mucho a SRT, con algunas diferencias que importan. Un archivo VTT empieza con la palabra WEBVTT, usa un punto en lugar de una coma antes de los milisegundos y no necesita bloques numerados. La mayoría de los reproductores web lo leen. Si no estás seguro de qué formato necesitas, la guía sobre SRT y VTT explica la elección.',
  ],

  sections: [
    {
      title: 'Cómo usar un archivo VTT en tu página web',
      paragraphs: [
        'Guarda el archivo .vtt junto a tu video y añade un elemento track dentro del elemento video, por ejemplo: <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. Los atributos hacen lo siguiente.',
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Usa subtitles para las palabras que se dicen. Usa captions cuando el archivo también describe otros sonidos, como música o risas.',
        },
        {
          title: 'srclang.',
          text: 'El idioma del archivo como código corto, por ejemplo en para inglés o es para español. Añade un elemento track por cada idioma que tengas.',
        },
        {
          title: 'label y default.',
          text: 'label es el nombre que se muestra en el menú de subtítulos del reproductor. default activa esa pista cuando se carga la página.',
        },
      ],
    },
    {
      title: 'Por qué no se muestran los subtítulos: las causas habituales',
      paragraphs: [
        'Mantén el archivo .vtt en el mismo sitio que la página. Un archivo en otro dominio necesita los encabezados de origen cruzado adecuados de su servidor, y el elemento video necesita un atributo crossorigin, o el navegador lo ignora en silencio. Comprueba también que la primera línea del archivo diga WEBVTT y que los subtítulos estén activados en los controles del reproductor.',
      ],
    },
    {
      title: 'Qué hace y qué no hace este generador',
      paragraphs: [
        'Convierte la voz de tu video en texto con tiempos. Las líneas se cortan en los finales de frase y en las pausas, en líneas de unos 42 caracteres con dos líneas como máximo, y el archivo contiene solo texto con tiempos. No traduce a otros idiomas (salvo al inglés, mediante Salida en Más opciones), no añade nombres de quienes hablan, no crea estilos ni marcadores de capítulos y no incrusta los subtítulos en la imagen. El propio WebVTT admite estilos y capítulos, y puedes añadirlos a mano en un editor de texto.',
      ],
    },
  ],

  howTitle: 'Cómo generar un archivo de subtítulos VTT',
  howToDescription:
    'Añade un video, elige el idioma, revisa las líneas y descarga los subtítulos como archivo WebVTT.',
  steps: [
    {
      title: 'Añade tu video',
      text: 'Pon un video en el cuadro de la parte superior de esta página: suéltalo allí o pulsa Elegir un archivo. Un archivo solo de sonido también sirve, si lo único que necesitas es texto con tiempos. En la página siguiente, Añadir otro archivo incorpora más.',
    },
    {
      title: 'Elige el idioma',
      text: 'En la página siguiente, elige el idioma hablado o deja activado Detectar automáticamente. Mantén activado Tiempos por palabra en Más opciones: el inicio y el final de cada línea siguen entonces a las palabras. Después pulsa Transcribir.',
    },
    {
      title: 'Revisa las líneas',
      text: 'Lee la transcripción, reproduce desde una marca de tiempo para comprobarla y corrige las palabras equivocadas. Borra las líneas que no quieras en los subtítulos.',
    },
    {
      title: 'Descarga el VTT',
      text: 'Elige VTT entre las opciones de descarga. Se incluyen tus ediciones. SRT está disponible desde la misma transcripción si un reproductor lo necesita.',
    },
  ],

  formatsTitle: 'El formato VTT y los archivos compatibles',
  formatsIntro:
    'Añade cualquier archivo de video o de audio y descarga WebVTT. Así es un archivo VTT por dentro:',
  uploadTitle: 'Archivos que puedes añadir',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: 'WebVTT para el elemento de video de HTML5 y para reproductores web' },
    { name: 'SRT', use: 'líneas numeradas, para la mayoría de los reproductores y editores' },
    { name: 'TXT', use: 'las mismas palabras sin tiempos' },
    { name: 'Markdown', use: 'texto con marcas de tiempo' },
    { name: 'JSON', use: 'cada línea y cada tiempo, para programas' },
    { name: 'PDF', use: 'un guion imprimible' },
  ],
  exampleLabel: 'Un ejemplo de archivo WebVTT',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Good morning, everyone, and welcome.

00:00:04.000 --> 00:00:07.300
In this video we set up the project from scratch.

00:00:07.700 --> 00:00:10.900
Let's start with the folder structure.`,

  tipsTitle: 'Consejos para archivos WebVTT',
  tips: [
    {
      title: 'Pruébalo en un navegador real.',
      text: 'Abre tu página, pulsa reproducir y activa los subtítulos en los controles del video. Hazlo en más de un navegador antes de publicar.',
    },
    {
      title: 'Usa el código de idioma correcto.',
      text: 'Pon en srclang un código válido como en, es o hi. Un código incorrecto puede hacer que el reproductor etiquete o elija mal la pista.',
    },
    {
      title: 'Lee las líneas a ritmo real.',
      text: 'Reproduce el video sin sonido y con los subtítulos activados, y comprueba que cada línea permanece en pantalla el tiempo suficiente para leerla.',
    },
    {
      title: 'Escribe los nombres como quieres.',
      text: 'Pon los nombres de marcas y los términos técnicos en la pista de vocabulario de Más opciones antes de empezar, para que salgan bien en cada línea.',
    },
  ],

  faqs: [
    {
      question: '¿En qué se diferencia un archivo VTT de un archivo SRT?',
      answer:
        'Un archivo VTT empieza con la línea WEBVTT, escribe los tiempos con un punto (00:00:01.000) donde SRT usa una coma (00:00:01,000) y no necesita números de bloque. Los navegadores leen VTT en el elemento video, mientras que SRT necesita un reproductor o un script que lo admita.',
    },
    {
      question: '¿Cómo añado un archivo VTT a un video HTML?',
      answer:
        'Guarda el archivo .vtt junto al video y añade un elemento track dentro del elemento video, con kind igual a subtitles, src apuntando al archivo, srclang igual al código de idioma y un label para el menú.',
    },
    {
      question: '¿Qué reproductores leen archivos VTT?',
      answer:
        'Todos los navegadores principales leen VTT a través del elemento video, y la mayoría de los reproductores de video web también. Algunos reproductores de escritorio y editores prefieren SRT. Para ellos, descarga SRT desde la misma transcripción.',
    },
    {
      question: '¿Puede el archivo VTT incluir capítulos o estilos?',
      answer:
        'El archivo que genera TranscribeVid contiene solo texto con tiempos. El propio WebVTT admite estilos y capítulos, que puedes añadir a mano en un editor de texto.',
    },
    {
      question: '¿Por qué no aparece mi archivo VTT en el reproductor?',
      answer:
        'Las causas habituales son una primera línea que no es WEBVTT, un archivo en otro dominio sin los encabezados de origen cruzado adecuados, un srclang o un kind incorrectos, o subtítulos desactivados en el reproductor. Abre el archivo en un editor de texto y comprueba la primera línea.',
    },
  ],

  links: [
    {
      label: 'Generador de subtítulos SRT',
      path: '/srt-subtitle-generator',
      note: 'La misma transcripción como archivo SRT numerado, con un ejemplo práctico.',
    },
    {
      label: 'SRT frente a VTT: qué formato de subtítulos usar',
      path: '/guides/srt-vs-vtt',
      note: 'Una comparación de los dos formatos y de dónde funciona cada uno.',
    },
    {
      label: 'Cómo añadir subtítulos a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'De la transcripción a los subtítulos publicados, para la web y para otros reproductores.',
    },
    {
      label: 'WebM a texto',
      path: '/webm-to-text',
      note: 'Para grabaciones de pantalla y del navegador, el formato que mejor encaja con un archivo VTT.',
    },
  ],
};
