import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Audio a texto',
  h1: 'Pasar audio a texto sin registrarte',
  lead: 'Añade un pódcast, una entrevista, una clase o una nota de voz y obtén una transcripción con marcas de tiempo que puedes buscar, editar y descargar. Gratis, ilimitado y en más de 50 idiomas.',
  dropKind: 'audio',
  dropNoun: 'audio',
  record: true,

  whyTitle: 'Cuándo merece la pena pasar audio a texto',
  why: [
    'El audio es el medio más difícil de ojear. No puedes buscarlo, repasarlo ni citarlo sin volver a escucharlo. Una transcripción te permite encontrar el minuto en que se dijo algo, extraer citas exactas y leer una conversación de una hora en unos minutos.',
    'Los usos típicos son las notas de un pódcast, las entrevistas de periodismo o investigación, la historia oral, las notas de voz, los borradores dictados y las grabaciones de clases o charlas. Transcribe solo grabaciones que hayas hecho tú o que tengas permiso para usar.',
  ],

  howTitle: 'Cómo convertir audio a texto',
  howToDescription:
    'Añade un archivo de audio o graba uno, elige el idioma, espera la transcripción y descárgala.',
  steps: [
    {
      title: 'Añade tu audio',
      text: 'Suelta un archivo de audio en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. Para grabar uno nuevo, pulsa Grabar con tu micrófono debajo del cuadro.',
    },
    {
      title: 'Elige el idioma',
      text: 'Selecciona el idioma hablado o deja la detección automática. Estándar es un buen comienzo con voces claras. Más rápido es veloz; Máxima precisión tarda más y comete menos errores.',
    },
    {
      title: 'Espera el texto',
      text: 'Las líneas aparecen a medida que se reconocen. Mejorar el audio, que viene activado por defecto, filtra los ruidos graves y el siseo y nivela a las personas que hablan bajo.',
    },
    {
      title: 'Revisa y exporta',
      text: 'Reproduce cualquier línea desde su marca de tiempo, corrige los errores y descarga la transcripción en el formato que necesites.',
    },
  ],

  formatsTitle: 'Archivos de audio compatibles y descargas',
  formatsIntro:
    'Los formatos de audio habituales funcionan. También se aceptan archivos de video, y solo se usa su sonido.',
  uploadTitle: 'Archivos de audio que puedes subir',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'texto limpio para notas y borradores' },
    { name: 'Markdown', use: 'texto con tiempos, listo para una aplicación de notas' },
    { name: 'PDF', use: 'una transcripción para imprimir' },
    { name: 'SRT', use: 'líneas con tiempos para subtítulos' },
    { name: 'VTT', use: 'líneas con tiempos para reproductores web' },
    { name: 'JSON', use: 'cada línea y su tiempo, para programas' },
  ],

  tipsTitle: 'Consejos para transcripciones de audio precisas',
  tips: [
    {
      title: 'Acércate al micrófono.',
      text: 'El eco y la distancia suelen importar más que el formato del archivo. Una habitación tranquila y un micrófono cercano valen más que cualquier ajuste.',
    },
    {
      title: 'Una voz cada vez.',
      text: 'Las voces que se solapan, la música bajo la voz y el ruido de fondo intenso causan la mayoría de los errores.',
    },
    {
      title: 'Sube el original.',
      text: 'Volver a guardar una grabación como un archivo más pequeño elimina detalle. Usa el original o la copia de mejor calidad que tengas.',
    },
    {
      title: 'Usa una pista de vocabulario.',
      text: 'Los nombres, las marcas y los términos técnicos son lo que más se equivocan los reconocedores de voz. Escríbelos en Más opciones.',
    },
    {
      title: 'Pregunta antes de grabar.',
      text: 'Pide permiso antes de grabar o transcribir la voz de otras personas y consulta las normas locales sobre la grabación de llamadas.',
    },
  ],

  faqs: [
    {
      question: '¿Qué formatos de audio puedo convertir a texto?',
      answer:
        'MP3, WAV, M4A, AAC, FLAC, OGG y OPUS. Los archivos de video como MP4 y MKV también sirven, porque solo se usa el sonido.',
    },
    {
      question: '¿Puedo grabar audio directamente en la página?',
      answer:
        'Sí, en los navegadores que permiten el acceso al micrófono. Pulsa Grabar desde el micrófono, permite el acceso cuando se te pida y detén la grabación. La grabación se transcribe cuando la detienes, no mientras hablas.',
    },
    {
      question: '¿Funciona con una entrevista de dos personas?',
      answer:
        'Sí, se transcribe la voz de ambas personas. No se añaden nombres ni etiquetas de hablantes, pero cada línea tiene una marca de tiempo y puedes escribir los nombres en el texto mientras editas.',
    },
    {
      question: '¿Cuánto puede durar el audio?',
      answer:
        '{limits} Los archivos más largos o más grandes se rechazan antes de procesarlos, así que divídelos primero. No hay cuota diaria ni mensual.',
      browser: {
        answer:
          'No ponemos ningún límite: el audio se transcribe en tu navegador, en tu propio dispositivo, así que las grabaciones largas simplemente tardan más y necesitan suficiente memoria libre. La página te avisa si tu dispositivo es lento. No hay cuota diaria ni mensual.',
      },
    },
    {
      question: '¿Se guarda mi audio?',
      answer:
        'Los archivos se conservan solo durante tu sesión y se eliminan automáticamente cuando termina, o al instante cuando pulsas Borrar mis datos ahora. No hay cuenta.',
      browser: {
        answer:
          'Solo en este navegador: tu audio nunca sale de tu dispositivo. Se elimina automáticamente tras un periodo de inactividad, o al instante cuando pulsas Borrar mis datos ahora. No hay cuenta.',
      },
    },
  ],
};
