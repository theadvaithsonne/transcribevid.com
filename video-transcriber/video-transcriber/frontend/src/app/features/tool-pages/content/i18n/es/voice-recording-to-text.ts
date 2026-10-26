import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Grabación de voz a texto',
  h1: 'Pasar una nota de voz o una grabación a texto, desde tu navegador',
  lead: 'Graba con tu micrófono en la propia página, o sube una nota de voz de tu teléfono, y lee después tus palabras como texto. Gratis, sin iniciar sesión, en más de 50 idiomas.',
  dropKind: 'audio',
  dropNoun: 'grabación de voz',
  record: true,

  whyTitle: 'Para qué sirve y para qué no',
  why: [
    'Hablar es más rápido que escribir, así que mucha gente recoge ideas, notas de reuniones, puntos de una clase y primeros borradores como una grabación de voz y los convierte en texto después. Esta página está pensada para eso: grabas o subes, y luego lees, editas y descargas el texto.',
    'No es dictado en directo. Grabas, detienes la grabación, y la transcripción se hace a partir de toda la grabación, así que las palabras no aparecen mientras sigues hablando. A cambio, cada línea recibe una marca de tiempo.',
  ],

  howTitle: 'Cómo convertir una grabación de voz en texto',
  howToDescription:
    'Graba con tu micrófono o sube una nota de voz, elige el idioma, espera la transcripción y descárgala.',
  steps: [
    {
      title: 'Graba o elige un archivo',
      text: 'Suelta una nota de voz en el cuadro de la parte superior de esta página (las Notas de voz del iPhone son archivos M4A) o pulsa Elegir un archivo. Para grabar en su lugar, pulsa Grabar con tu micrófono debajo del cuadro, luego Grabar desde el micrófono, y permite el acceso cuando tu navegador te lo pida.',
    },
    {
      title: 'Detén la grabación y elige el idioma',
      text: 'Si estás grabando, pulsa Detener grabación cuando termines. Después selecciona el idioma hablado o deja la detección automática.',
    },
    {
      title: 'Espera la transcripción',
      text: 'El texto aparece línea por línea, con una barra de progreso y una estimación del tiempo restante.',
    },
    {
      title: 'Edita y descarga',
      text: 'Corrige cualquier palabra y descarga TXT, Markdown o PDF. Las transcripciones solo existen durante tu sesión, así que guarda lo que necesites.',
    },
  ],

  formatsTitle: 'Formatos de notas de voz y descargas',
  formatsIntro:
    'Las grabadoras de voz de los teléfonos y de las computadoras guardan en formatos distintos. Todos estos funcionan.',
  uploadTitle: 'Archivos de grabación que puedes subir',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'tus palabras como texto sin formato' },
    { name: 'Markdown', use: 'notas con tiempos' },
    { name: 'PDF', use: 'una copia de la nota para imprimir' },
    { name: 'SRT', use: 'líneas con tiempos, si la grabación acompaña a un video' },
    { name: 'VTT', use: 'líneas con tiempos para reproductores web' },
    { name: 'JSON', use: 'líneas estructuradas para programas' },
  ],

  tipsTitle: 'Consejos para las grabaciones de voz',
  tips: [
    {
      title: 'Prueba el micrófono.',
      text: 'Graba diez segundos y escúchalos antes de una sesión larga.',
    },
    {
      title: 'Habla a un ritmo constante.',
      text: 'Habla cerca del micrófono en una sala tranquila. Los ventiladores, los teclados y el viento se captan tan bien como tu voz.',
    },
    {
      title: 'Di los nombres y los números con claridad.',
      text: 'Añade las palabras poco habituales a la pista de vocabulario en Más opciones y será mucho más probable que salgan bien.',
    },
    {
      title: '¿No ves el botón del micrófono?',
      text: 'Algunos navegadores solo permiten grabar en páginas seguras o después de que des permiso. Graba con la aplicación de grabación de voz de tu teléfono y sube el archivo.',
    },
    {
      title: 'Respeta a los demás.',
      text: 'Avisa a las personas cuando las grabes y pídeles permiso antes.',
    },
  ],

  faqs: [
    {
      question: '¿Es dictado en directo?',
      answer:
        'No. Primero grabas y la transcripción se hace después. Si quieres palabras que aparezcan mientras hablas, usa en su lugar la función de dictado de tu teléfono o de tu computadora.',
    },
    {
      question: '¿Puedo usarlo en el teléfono?',
      answer:
        'Sí. Abre la página en el navegador de tu teléfono y graba en la propia página, o sube un archivo de nota de voz que ya hayas guardado.',
    },
    {
      question: '¿Cuánto puede durar una grabación?',
      answer:
        '{limits} Los archivos más largos se rechazan antes de procesarlos, así que divídelos primero. No hay cuota diaria ni mensual.',
      browser: {
        answer:
          'No ponemos ningún límite: la grabación se transcribe en tu navegador, en tu propio dispositivo, así que una larga simplemente tarda más. La página te avisa si tu dispositivo es lento. No hay cuota diaria ni mensual.',
      },
    },
    {
      question: '¿Distingue a los hablantes?',
      answer:
        'No. No se añaden nombres ni etiquetas de hablantes. Cada línea tiene una marca de tiempo y puedes escribir los nombres en el texto mientras editas.',
    },
    {
      question: '¿Se guarda mi grabación de voz?',
      answer:
        'Solo durante tu sesión. Se elimina cuando termina la sesión, tras un periodo de inactividad, o cuando pulsas Borrar mis datos ahora. No hay cuenta.',
      browser: {
        answer:
          'Solo en este navegador: tu grabación nunca sale de tu dispositivo. Se elimina tras un periodo de inactividad, o cuando pulsas Borrar mis datos ahora. No hay cuenta.',
      },
    },
  ],
};
