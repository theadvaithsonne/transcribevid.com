import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Generador de subtítulos SRT',
  h1: 'Generador de subtítulos SRT a partir de un video o un audio',
  lead: 'Sube un video y descarga un archivo .srt listo para usar con cada línea sincronizada con la voz. Gratis, sin iniciar sesión, y puedes corregir el texto antes de exportar.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Qué contiene un archivo SRT',
  why: [
    'Un archivo SRT es texto sin formato. Enumera subtítulos numerados, cada uno con una hora de inicio, una hora de fin y las palabras que se muestran en pantalla. La mayoría de los reproductores de video, los editores y las plataformas de video pueden cargar uno, lo que lo convierte en el formato de subtítulos más seguro para empezar.',
    'Los subtítulos ayudan a las personas sordas o con dificultades de audición, a quienes ven un video sin sonido y a cualquiera que sigue mejor un segundo idioma por escrito. También hacen que la voz de tu video se pueda buscar y citar.',
  ],

  howTitle: 'Cómo generar un archivo SRT',
  howToDescription:
    'Sube un video, elige el idioma, revisa las líneas y descarga los subtítulos como archivo SRT o VTT.',
  steps: [
    {
      title: 'Sube el video',
      text: 'Suelta tu video en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. Un archivo de audio también sirve si solo necesitas texto con tiempos.',
    },
    {
      title: 'Elige el idioma',
      text: 'Elige el idioma hablado. El tiempo palabra por palabra viene activado por defecto, lo que da una sincronización más ajustada de los subtítulos.',
    },
    {
      title: 'Revisa las líneas',
      text: 'Abre la transcripción, reproduce desde cualquier marca de tiempo y corrige las palabras equivocadas. Elimina las líneas que no quieras.',
    },
    {
      title: 'Descarga SRT o VTT',
      text: 'Elige SRT para la mayoría de los reproductores y editores, o VTT para páginas web. Los dos incluyen tus ediciones.',
    },
  ],

  formatsTitle: 'Formatos de subtítulos y archivos compatibles',
  formatsIntro:
    'Sube cualquier archivo de video o audio y descarga los subtítulos como SRT o VTT. Así se ve por dentro un archivo SRT:',
  uploadTitle: 'Archivos que puedes subir',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'subtítulos numerados con tiempos, la compatibilidad más amplia' },
    { name: 'VTT', use: 'WebVTT para video HTML5 y reproductores web' },
    { name: 'TXT', use: 'las mismas palabras sin tiempos' },
    { name: 'Markdown', use: 'texto con marcas de tiempo' },
    { name: 'JSON', use: 'cada línea y su tiempo, para programas' },
    { name: 'PDF', use: 'un guion para imprimir' },
  ],
  exampleLabel: 'Un ejemplo de archivo SRT',
  example: `1
00:00:01,000 --> 00:00:04,200
Bienvenidos de nuevo al canal.

2
00:00:04,500 --> 00:00:07,800
Hoy vamos a ver cómo funcionan los subtítulos.`,

  tipsTitle: 'Consejos para mejores subtítulos',
  tips: [
    {
      title: 'Mantén las líneas cortas.',
      text: 'Una pauta habitual son dos líneas de unos 42 caracteres. Las líneas siguen la voz, así que las muy largas pueden necesitar dividirse en un editor de subtítulos.',
    },
    {
      title: 'Míralo antes de publicar.',
      text: 'Reproduce el video con los subtítulos activados. Los subtítulos automáticos necesitan una revisión humana, sobre todo en nombres, números y jerga.',
    },
    {
      title: 'Usa una pista de vocabulario.',
      text: 'Escribe nombres y términos técnicos en Más opciones para que aparezcan escritos como quieres.',
    },
    {
      title: 'Elige el formato adecuado.',
      text: 'SRT para reproductores, editores y la mayoría de los formularios de subida. VTT para la etiqueta de video HTML5 y los reproductores web.',
    },
    {
      title: '¿Necesitas subtítulos en inglés?',
      text: 'Pon Salida en Traducir al inglés en Más opciones. La traducción es automática, así que léela entera antes de publicar.',
    },
  ],

  faqs: [
    {
      question: '¿Qué es un archivo SRT?',
      answer:
        'SubRip (.srt) es un formato de subtítulos en texto sin formato. Cada subtítulo tiene un número, una hora de inicio y de fin y el texto que se muestra. Cualquier editor de texto puede abrirlo.',
    },
    {
      question: '¿Debo elegir SRT o VTT?',
      answer:
        'Usa SRT para reproductores de video, editores y la mayoría de los formularios de subida. Usa VTT (WebVTT) cuando añadas subtítulos a una página web con el elemento de video HTML5. TranscribeVid exporta ambos a partir de la misma transcripción.',
    },
    {
      question: '¿Incrusta los subtítulos en mi video?',
      answer:
        'No. Obtienes un archivo de subtítulos aparte y el video no se modifica. Para incrustar los subtítulos en la imagen necesitas un editor de video.',
    },
    {
      question: '¿Qué precisión tiene la sincronización?',
      answer:
        'La sincronización sigue la voz y suele ser cercana, pero no es exacta fotograma a fotograma. Revisa la primera y la última línea y ajusta en un editor de subtítulos si necesitas una sincronía exacta.',
    },
    {
      question: '¿Puedo hacer subtítulos en otro idioma?',
      answer:
        'Puedes transcribir en el idioma hablado (se admiten más de 50) o traducir la voz al inglés. No se ofrece la traducción a otros idiomas.',
    },
  ],
};
