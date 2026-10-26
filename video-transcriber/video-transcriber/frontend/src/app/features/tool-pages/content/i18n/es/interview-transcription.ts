import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Transcripción de entrevistas',
  h1: 'Transcripción de entrevistas sin necesidad de cuenta',
  lead: 'Convierte una entrevista grabada en texto con marcas de tiempo en el que puedes buscar, citar y comprobar con la grabación. Pensado para investigación, periodismo y entrevistas de selección: gratis, sin iniciar sesión y en más de 50 idiomas.',
  dropKind: 'video',
  dropNoun: 'grabación de la entrevista',

  whyTitle: 'Por qué transcribir una entrevista',
  why: [
    'Una entrevista vale más cuando puedes buscar en ella. Una transcripción te permite encontrar dónde mencionó un participante un tema, citarlo con exactitud, comprobar una cita con la grabación y comparar respuestas entre varias entrevistas. Investigadores, periodistas, historiadores orales y quienes realizan entrevistas de investigación de usuarios o de selección trabajan así.',
    'Las entrevistas suelen contener detalles privados o delicados. Aquí la grabación se sube por una conexión cifrada y se elimina automáticamente después. Consigue el consentimiento de todos antes de grabar, sigue las normas de tu organización o de tu comité de ética y trata la transcripción con tanto cuidado como la grabación.',
  ],
  browserWhy: [
    'Una entrevista vale más cuando puedes buscar en ella. Una transcripción te permite encontrar dónde mencionó un participante un tema, citarlo con exactitud, comprobar una cita con la grabación y comparar respuestas entre varias entrevistas. Investigadores, periodistas, historiadores orales y quienes realizan entrevistas de investigación de usuarios o de selección trabajan así.',
    'Las entrevistas suelen contener detalles privados o delicados, así que importa adónde va el archivo. Tu navegador transcribe la grabación en tu propio dispositivo y no se sube nada. Consigue el consentimiento de todos antes de grabar, sigue las normas de tu organización o de tu comité de ética y trata la transcripción con tanto cuidado como la grabación: el texto descargado es un archivo en tu dispositivo como cualquier otro.',
  ],

  sections: [
    {
      title: 'Qué te da y qué no te da la transcripción',
      paragraphs: ['Conoce los límites antes de basarte en una transcripción.'],
      bullets: [
        {
          title: 'Sin etiquetas de quien habla.',
          text: 'Cada línea tiene una marca de tiempo, pero la transcripción no dice quién habla. Añade Entrevistador y Participante a mano mientras editas, comprobándolo con la grabación.',
        },
        {
          title: 'Una lectura limpia, no estrictamente literal.',
          text: 'Los reconocedores suelen omitir los balbuceos y algunas palabras de relleno como «eh». Si tu estudio necesita un registro estrictamente literal, reproduce la grabación junto al texto y añade lo que falte.',
        },
        {
          title: 'Solo después de la entrevista.',
          text: 'Trabaja con una grabación guardada. No se une a una llamada ni transcribe en directo.',
        },
      ],
    },
    {
      title: 'Comprobar una transcripción antes de citarla',
      paragraphs: [
        'Antes de publicar una cita o de citar a un participante, reproduce la línea desde su marca de tiempo y escucha. Las líneas de las que el reconocedor no estaba seguro están marcadas, así que empieza por ahí. Comprueba nombres, números y fechas, y cualquier palabra que cambiaría el sentido si estuviera mal, como «puede» y «no puede». Para encontrar todos los lugares donde aparece un nombre o un término, escríbelo en el cuadro Buscar en el texto que hay encima de la transcripción terminada: cuenta las líneas que coinciden y las flechas pasan de una a otra.',
        'Conserva la grabación como registro principal y trata la transcripción como una copia de trabajo. Si describes tu método en un informe o artículo, di que la transcripción se hizo con reconocimiento de voz y luego se revisó a mano.',
      ],
    },
    {
      title: 'Consentimiento, almacenamiento y anonimato',
      paragraphs: [
        'Explica a los participantes cómo se almacenarán la grabación y la transcripción y quién las verá. Si prometiste anonimato, quita los nombres y los detalles que podrían identificar a alguien antes de compartir extractos. Esta página no puede hacerlo por ti y no ofrece asesoramiento jurídico.',
      ],
    },
  ],

  howTitle: 'Cómo transcribir una entrevista',
  howToDescription:
    'Añade la grabación de la entrevista, elige el idioma, añade los nombres, espera la transcripción, y luego revísala y descárgala.',
  steps: [
    {
      title: 'Añade la grabación de la entrevista',
      text: 'Pulsa Elegir un archivo o arrastra la entrevista al cuadro de arriba. Sirven tanto audio como video. Añade aquí una entrevista y usa después Añadir otro archivo en la página siguiente para el resto de tu conjunto.',
    },
    {
      title: 'Elige idioma y calidad',
      text: 'En la página siguiente, selecciona el idioma de la entrevista o deja Detectar automáticamente. Estándar sirve para una conversación tranquila entre dos personas. El eco, una línea telefónica o un acento marcado piden Alta precisión donde tu dispositivo pueda ejecutarla; un dispositivo que no puede muestra la opción en gris con un motivo. Es más lenta y requiere una primera descarga más grande.',
    },
    {
      title: 'Añade nombres y términos, y empieza',
      text: 'En Más opciones, enumera en la pista de vocabulario los nombres de los participantes, sus organizaciones y los términos especializados, para que se escriban como quieres. Después pulsa Transcribir.',
    },
    {
      title: 'Revisa, etiqueta y exporta',
      text: 'Reproduce líneas desde sus marcas de tiempo, corrige los errores y añade a mano las etiquetas de quien habla. Después descarga TXT o PDF para tus archivos, o Markdown o JSON si necesitas líneas con tiempos.',
    },
  ],

  formatsTitle: 'Archivos de grabaciones de entrevistas y descargas',
  formatsIntro:
    'Las entrevistas vienen de teléfonos, grabadoras y videollamadas. Se puede añadir cualquiera de ellas, y lo único que se lee es la pista de sonido.',
  uploadTitle: 'Archivos de grabación que puedes añadir',
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'texto plano para leer, citar y codificar' },
    { name: 'PDF', use: 'una copia para imprimir o archivar' },
    {
      name: 'Markdown',
      use: 'texto con tiempos para una aplicación de notas o un programa de codificación',
    },
    { name: 'JSON', use: 'líneas con tiempos para software de análisis' },
  ],

  tipsTitle: 'Consejos para grabaciones de entrevistas',
  tips: [
    {
      title: 'Pon el micrófono cerca.',
      text: 'Colócalo cerca del participante y usa unos auriculares con micrófono o un micrófono de solapa en llamadas telefónicas y videollamadas. Un micrófono al otro lado de la sala o un espacio con eco suele costar más precisión de la que puede recuperar cualquier ajuste.',
    },
    {
      title: 'Di la fecha y los nombres al empezar.',
      text: 'Di quién participa y cuándo, al comienzo de la grabación. Así el archivo es fácil de etiquetar y la transcripción, fácil de archivar después.',
    },
    {
      title: 'Conserva la grabación original.',
      text: 'No borres nunca el audio cuando ya tengas el texto. La grabación es lo que resuelve una duda sobre una cita.',
    },
    {
      title: 'Respeta los límites.',
      text: 'Todo lo que supere los límites que se muestran en esta página se rechaza, así que corta antes una entrevista muy larga en una pausa natural.',
      browser: {
        title: 'Las entrevistas largas tardan más.',
        text: 'No hay tope de duración, aunque una grabación larga necesita tiempo y memoria libre en tu dispositivo, y un navegador sin WebCodecs puede tener problemas con un archivo muy largo. Córtalo en una pausa natural si prefieres empezar por la primera parte.',
      },
    },
    {
      title: 'Borra tus datos en una computadora compartida.',
      text: 'Cuando hayas guardado lo que necesitas, pulsa Borrar mis datos ahora, para que la transcripción no se quede en la sesión.',
    },
  ],

  faqs: [
    {
      question: '¿Puedo transcribir aquí una entrevista confidencial?',
      answer:
        'Tu grabación se sube por una conexión cifrada y el servidor la elimina cuando termina la sesión, o antes si pulsas Borrar mis datos ahora. Antes de fiarte de eso, comprueba lo que exige tu organización o tu comité de ética. Esto no es asesoramiento jurídico.',
      browser: {
        answer:
          'No se sube nada: la grabación se queda en tu dispositivo mientras tu navegador la transcribe, y el navegador la borra tras un periodo de inactividad o cuando pulsas Borrar mis datos ahora. Una transcripción descargada es un archivo normal, así que consulta las normas de tu organización o de tu comité de ética. Esto no es asesoramiento jurídico.',
      },
    },
    {
      question: '¿La transcripción de la entrevista incluye los «eh» y los «mmm»?',
      answer:
        'A menudo no. La transcripción es una lectura limpia y no un registro estrictamente literal, y se omiten algunos balbuceos y palabras de relleno. Si necesitas todos, reproduce la grabación junto al texto y añádelos.',
    },
    {
      question: '¿Puede la transcripción distinguir al entrevistador del participante?',
      answer:
        'No. La transcripción no marca quién habla. Escribe Entrevistador y Participante en el texto mientras editas, usando la grabación para comprobar cada intervención.',
    },
    {
      question: '¿Qué duración puede tener la entrevista que transcribo?',
      answer: '{limits} Una entrevista más larga puede necesitar dividirse.',
      browser: {
        answer:
          'La duración de la entrevista no tiene tope. Tu propio dispositivo hace el trabajo, así que una entrevista larga tarda más y necesita memoria libre, y la página te avisa si tu dispositivo parece demasiado lento.',
      },
    },
    {
      question: '¿Puedo usar estas transcripciones en mi investigación o en mi artículo?',
      answer:
        'Sí. Compruébalas con la grabación antes de citar a nadie, indica en tu método que se usó reconocimiento de voz y sigue las normas de tu institución o de tu publicación.',
    },
  ],

  links: [
    {
      label: 'Grabación de reunión a texto',
      path: '/meeting-recording-to-text',
      note: 'Para llamadas grabadas, con notas sobre cómo convertir una transcripción en actas.',
    },
    {
      label: 'Video a texto',
      path: '/video-to-text',
      note: 'La página general para cualquier video grabado.',
    },
    {
      label: 'Transcribir un video sin subirlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Qué ocurre con una grabación en tu navegador y cómo comprobarlo tú mismo.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Decisiones de audio y de ajustes que reducen los errores.',
    },
  ],
};
