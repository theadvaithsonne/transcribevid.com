import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Grabación de reunión a texto',
  h1: 'Transcribir reuniones a texto: grabaciones de Zoom, Teams y Google Meet',
  lead: 'Guarda la grabación después de tu llamada, suéltala aquí y obtén una transcripción con marcas de tiempo en la que puedes buscar, citar y convertir en actas. No cuesta nada, no necesita cuenta y cubre más de 50 idiomas.',
  dropKind: 'video',
  dropNoun: 'grabación de la reunión',

  whyTitle: 'Por qué transcribir la grabación de una reunión',
  why: [
    'Poca gente vuelve a ver una reunión de una hora, pero muchos necesitan una sola cosa de ella: quién aceptó qué y para cuándo. Una transcripción te permite buscar una fecha límite o un nombre, encontrar el minuto en que se dijo y citarlo con exactitud. Es un punto de partida más rápido para las actas y las listas de tareas que volver a reproducir la llamada.',
    'Esta página trabaja con una grabación que ya existe. No puede unirse a una llamada en directo y no añade nombres de quienes hablan, así que sustituye a la repetición, no a quien toma notas. Las reuniones suelen contener detalles confidenciales, así que conviene saber adónde va una grabación: aquí se sube por una conexión cifrada y se elimina automáticamente después.',
  ],
  browserWhy: [
    'Poca gente vuelve a ver una reunión de una hora, pero muchos necesitan una sola cosa de ella: quién aceptó qué y para cuándo. Una transcripción te permite buscar una fecha límite o un nombre, encontrar el minuto en que se dijo y citarlo con exactitud. Es un punto de partida más rápido para las actas y las listas de tareas que volver a reproducir la llamada.',
    'Esta página trabaja con una grabación que ya existe. No puede unirse a una llamada en directo y no añade nombres de quienes hablan, así que sustituye a la repetición, no a quien toma notas. Las reuniones suelen contener detalles confidenciales: tu navegador transcribe la grabación en tu propio dispositivo y no se sube nada, y no se conserva nada cuando termina tu sesión.',
  ],

  sections: [
    {
      title: 'Dónde encontrar la grabación de tu reunión',
      paragraphs: [
        'Cada herramienta de reuniones guarda las grabaciones en su propio lugar, y los nombres de los menús, las carpetas y lo que permite tu plan cambian entre versiones, así que toma esto como una guía. Si solo puedes exportar el audio, un archivo M4A o MP3 es más pequeño y se lee igual de bien. Zoom, Microsoft Teams y Google Meet son nombres que pertenecen a sus respectivos propietarios, y este sitio no tiene relación con ellos.',
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'Una grabación local se guarda en tu computadora cuando termina la reunión, normalmente como un video MP4 y un archivo de audio M4A. Una grabación en la nube se descarga desde la página de grabaciones de tu cuenta de Zoom.',
        },
        {
          title: 'Microsoft Teams.',
          text: 'Después de la reunión, la grabación se guarda en OneDrive o SharePoint, según el tipo de reunión, y aparece un enlace en el chat de la reunión. Ábrela allí y descarga el MP4 si tu cuenta permite descargas.',
        },
        {
          title: 'Google Meet.',
          text: 'Las grabaciones se guardan en Google Drive, normalmente en una carpeta Meet Recordings, y el organizador recibe un enlace. Descarga el MP4 desde Drive.',
        },
      ],
    },
    {
      title: 'De la transcripción a las actas',
      paragraphs: [
        'Una transcripción en bruto todavía no son las actas, pero hace que se escriban rápido. Cuando la transcripción esté terminada, escribe una palabra como plazo, acuerdo o acción en el cuadro Buscar en el texto que hay encima, o el nombre de alguien implicado. El cuadro muestra cuántas líneas coinciden, y las flechas arriba y abajo pasan de una a la siguiente. Lee alrededor de cada resultado, reproduce esa línea desde su marca de tiempo si no está clara y copia las líneas en tus notas con sus horas para que cualquiera pueda comprobar la grabación.',
        'Si un nombre salió escrito de dos maneras distintas, busca la grafía incorrecta, abre Reemplazar…, escribe la correcta y aplícala a todas las líneas a la vez. Descarga Markdown para pegarlo en una aplicación de notas, o PDF para enviarlo. Las líneas llevan una hora pero ninguna etiqueta de quién habla, así que escribe los nombres mientras editas, usando la grabación para comprobar quién habló.',
      ],
    },
    {
      title: 'Permiso, normas y cuidado',
      paragraphs: [
        'Avisa a todos antes de grabar una reunión y pide su permiso, y sigue las normas de tu organización sobre grabaciones y transcripciones. La transcripción de una reunión confidencial es tan delicada como la grabación, así que guárdala y compártela con el mismo cuidado. Esta página no ofrece asesoramiento jurídico.',
      ],
    },
  ],

  howTitle: 'Cómo convertir la grabación de una reunión en texto',
  howToDescription:
    'Añade la grabación de la reunión, elige el idioma, espera la transcripción y descárgala como texto o subtítulos.',
  steps: [
    {
      title: 'Añade la grabación',
      text: 'Pulsa Elegir un archivo o arrastra la grabación al cuadro de arriba. Sirve un video MP4 o un archivo de audio M4A, y solo se usa el sonido. El cuadro acepta una grabación cada vez y la pasa al cargador de la página siguiente, donde Añadir otro archivo permite incorporar el resto de las llamadas de un día.',
    },
    {
      title: 'Elige idioma y calidad',
      text: 'En la página siguiente, elige el idioma que hablaron las personas o deja Detectar automáticamente. Estándar sirve para la mayoría de las llamadas. Si tu dispositivo las ofrece, Alta precisión y Máxima precisión van bien con quienes hablan rápido o con mal audio; si no, aparecen en gris con el motivo. Las dos son más lentas y requieren una primera descarga más grande. Si las personas cambian de idioma, elige el principal y revisa las líneas marcadas como dudosas. Después pulsa Transcribir.',
    },
    {
      title: 'Espera la transcripción',
      text: 'Las líneas aparecen a medida que se procesa la grabación, con una barra de progreso y una estimación del tiempo restante. Una reunión larga tarda más.',
      browser: {
        text: 'Las líneas aparecen a medida que se procesa la grabación, con una barra de progreso y una estimación del tiempo restante. Tu propio dispositivo hace el trabajo, así que una reunión larga tarda más: mantén esta página abierta hasta que termine.',
      },
    },
    {
      title: 'Busca, edita y exporta',
      text: 'Escribe nombres y palabras de decisión en Buscar en el texto para saltar entre líneas, reproduce una línea desde su marca de tiempo para comprobarla y corrige los errores. Después descarga TXT, Markdown o PDF. Añade a mano los nombres de quienes hablan mientras editas.',
    },
  ],

  formatsTitle: 'Archivos de grabaciones de reuniones y descargas',
  formatsIntro:
    'Las grabaciones de Zoom, Teams y Meet suelen ser MP4 o M4A. Otros archivos de video y audio también sirven, y solo se lee la pista de sonido.',
  uploadTitle: 'Archivos de grabación que puedes añadir',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'toda la reunión como texto plano' },
    { name: 'Markdown', use: 'apuntes con tiempos para pegar en una aplicación de notas' },
    { name: 'PDF', use: 'una copia para imprimir o enviar' },
    { name: 'SRT', use: 'líneas con tiempos para subtitular la grabación' },
  ],

  tipsTitle: 'Consejos para transcripciones de reuniones',
  tips: [
    {
      title: 'Usa el archivo de solo audio cuando exista.',
      text: 'Contiene la misma voz en un archivo mucho más pequeño, así que es más rápido de añadir y de procesar.',
    },
    {
      title: 'Pon nombres y términos en la pista de vocabulario.',
      text: 'En Más opciones, enumera las personas, los nombres de productos y las siglas que se usaron en la reunión. Así los nombres y las siglas salen como esperas.',
    },
    {
      title: 'Espera errores cuando se hablan encima.',
      text: 'Cuando dos personas hablan a la vez, el reconocedor no puede separarlas. Las líneas de las que no está seguro están marcadas, así que revísalas primero.',
    },
    {
      title: 'Respeta los límites.',
      text: 'Las grabaciones que superan los límites de tamaño o duración que se muestran en esta página no se pueden procesar, así que corta antes en partes una llamada muy larga.',
      browser: {
        title: 'Las llamadas largas tardan más.',
        text: 'El sitio no pone ningún límite de duración, pero la grabación de un taller de todo el día necesita tiempo y memoria libre en tu dispositivo. Para leer antes la primera hora, corta el archivo en partes con un editor de video.',
      },
    },
    {
      title: 'Comparte la transcripción con cuidado.',
      text: 'Envíala solo a quienes estuvieron en la reunión o la necesitan, y bórrala cuando ya no la necesites.',
    },
  ],

  faqs: [
    {
      question:
        '¿Puede TranscribeVid unirse a mi llamada de Zoom o Teams y transcribirla en directo?',
      answer:
        'No. Trabaja con una grabación que guardas después de la reunión. No puede unirse a una llamada y no es subtitulado en directo. Para subtítulos en directo, usa la función de tu herramienta de reuniones.',
    },
    {
      question: '¿La transcripción de una reunión muestra quién dijo qué?',
      answer:
        'No. Las líneas llevan una hora pero ningún nombre. Añade los nombres tú mismo mientras editas y comprueba cada uno con la grabación.',
    },
    {
      question: '¿Es seguro transcribir aquí la grabación de una reunión confidencial?',
      answer:
        'El servidor recibe la grabación por una conexión cifrada y la elimina cuando termina tu sesión, o antes si pulsas Borrar mis datos ahora. Comprueba antes lo que permite tu organización. Esto no es asesoramiento jurídico.',
      browser: {
        answer:
          'La grabación no se sube: tu navegador la transcribe en tu propio dispositivo y la borra tras un periodo de inactividad o cuando pulsas Borrar mis datos ahora. Una transcripción que descargas es un archivo normal en tu dispositivo, así que cuídala como cuidarías la grabación y comprueba lo que permite tu organización. Esto no es asesoramiento jurídico.',
      },
    },
    {
      question: '¿Qué duración puede tener la grabación de una reunión que transcribo?',
      answer: '{limits} Los archivos más largos no se pueden procesar, así que divídelos antes.',
      browser: {
        answer:
          'No se pone ningún tope a la grabación en sí, porque el trabajo se hace en tu propio dispositivo. Lo que te limita es el tiempo y la memoria libre: una llamada de varias horas es posible, la página te avisa si tu dispositivo parece demasiado lento para ella, y un navegador sin compatibilidad con WebCodecs puede no poder con un archivo muy largo.',
      },
    },
    {
      question: '¿Y si las personas cambian de idioma durante la reunión?',
      answer:
        'Elige el idioma que más se habla. El reconocimiento sigue mejor el idioma principal, así que las palabras en otro idioma pueden escribirse mal. Las líneas de las que no está seguro están marcadas: compruébalas con la grabación.',
    },
  ],

  links: [
    {
      label: 'MP4 a texto',
      path: '/mp4-to-text',
      note: 'Ajustes para una reunión guardada como video MP4.',
    },
    {
      label: 'M4A a texto',
      path: '/m4a-to-text',
      note: 'Para el archivo de solo audio, que es más pequeño que el video.',
    },
    {
      label: 'Transcripción de entrevistas',
      path: '/interview-transcription',
      note: 'Para una conversación grabada entre dos personas, con notas sobre el consentimiento y la comprobación de citas.',
    },
    {
      label: 'Transcribir un video sin subirlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Dónde se queda tu grabación y cómo confirmarlo en tu navegador.',
    },
  ],
};
