import { ToolPageContent } from '../../../tool-page.model';

/** Los límites citados de otros sitios son tal como decían sus propias páginas el 28 de octubre de 2026; la guía enlazada abajo contiene la tabla completa con fuentes. */
export const CONTENT: ToolPageContent = {
  eyebrow: 'Transcribir video a texto',
  h1: 'Transcribir video a texto: gratis, sin registro y sin límite diario',
  browserH1: 'Transcribir video a texto: gratis, sin registro, sin límites y sin subir nada',
  lead: 'Añade un video y recibe su voz en forma de texto, con la hora en cada línea. No hay que crear ninguna cuenta ni hay límite diario, así que puedes empezar con el siguiente video en cuanto termine este.',
  browserLead:
    'Añade un video y recibe su voz en forma de texto, con la hora en cada línea. No hay que crear ninguna cuenta, no hay límite diario ni límite de tamaño de archivo, y el video nunca se sube: lo procesa tu propio dispositivo.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Qué debería significar «gratis» al transcribir un video',
  why: [
    'Muchos sitios que dicen ofrecer «transcripción de video gratis» te dan un minuto, o unos pocos archivos, y después te piden una cuenta o una tarjeta. Antes de elegir uno, comprueba cuatro cosas: si tienes que registrarte, cuántos minutos o archivos te dan, qué tamaño de archivo aceptan y si puedes descargar el resultado.',
    'Aquí la respuesta a cada una es sencilla. Añades el video, no hay nada que registrar, no hay cuota diaria ni mensual, y la transcripción se descarga sin coste como TXT, SRT, VTT, PDF, Markdown o JSON. La herramienta no etiqueta a los hablantes y no acepta enlaces: añades el archivo mismo.',
  ],
  browserWhy: [
    'Muchos sitios que dicen ofrecer «transcripción de video gratis» te dan un minuto, o unos pocos archivos, y después te piden una cuenta o una tarjeta. Antes de elegir uno, comprueba cuatro cosas: si tienes que registrarte, cuántos minutos o archivos te dan, qué tamaño de archivo aceptan y si puedes descargar el resultado.',
    'Aquí la respuesta a cada una es sencilla. Añades el video, no hay nada que registrar, no hay cuota diaria ni mensual ni límite de tamaño, y la transcripción se descarga sin coste como TXT, SRT, VTT, PDF, Markdown o JSON. Como el trabajo lo hace tu dispositivo, su memoria es el único límite real: un video muy largo puede ser demasiado para un teléfono, así que divídelo antes en partes. La herramienta no etiqueta a los hablantes y no acepta enlaces: añades el archivo mismo.',
  ],

  sections: [
    {
      title: 'Límites gratuitos de otros sitios de transcripción de video, revisados en octubre de 2026',
      paragraphs: [
        'Son citas de la página de cada herramienta tal como decía el 28 de octubre de 2026, traducidas de sus páginas en inglés. Los planes cambian, así que mira la página antes de fiarte de una cifra. La guía enlazada al final de esta página tiene la tabla completa con un enlace a cada fuente.',
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '«Transcripciones ilimitadas gratis. No requiere registro.» La herramienta gratuita acepta archivos MP3, WAV, MP4 y MOV, y atribuye todo el texto de una grabación con varios hablantes a un solo hablante.',
        },
        { title: 'VoiceCheap.', text: '«Gratis para archivos de hasta 60 minutos, con 1 transcripción al día.»' },
        { title: 'RecCloud.', text: '«Nuestro plan gratuito permite videos de hasta 10 minutos de duración.»' },
        { title: 'Caption-X.', text: '«El plan gratuito cubre 5 transcripciones en total, de hasta 5 minutos cada una.»' },
        { title: 'Maestra.', text: 'Una «vista previa de 1 minuto» y «Regístrate para descargar o exportar tu transcripción.»' },
        { title: 'Any2Text.', text: '«Primeros 15 minutos gratis», y después $0.035 por minuto.' },
      ],
    },
    {
      title: 'Adónde va tu video mientras se transcribe',
      paragraphs: [
        'El video se envía al servidor que ejecuta este sitio, se transcribe allí y se elimina cuando termina tu sesión. No se publica en ningún otro lugar.',
      ],
      browser: {
        paragraphs: [
          'El video se queda en tu dispositivo. Tu navegador lo lee, extrae el sonido y ejecuta sobre él el modelo de voz Whisper, así que no se envía ningún archivo a nosotros ni a nadie más.',
          'Solo se descargan las herramientas: la página, el modelo de voz y el motor que lo ejecuta. El modelo pesa entre unos 77 MB y algo más de 1 GB, según el nivel de calidad y tu dispositivo, y después queda guardado en tu navegador. Para comprobarlo tú mismo, abre el panel de red de tu navegador mientras se transcribe un video.',
        ],
      },
    },
    {
      title: 'Cuatro niveles de calidad para distintos videos',
      paragraphs: [
        'Más rápido usa el modelo pequeño Base y sirve para un borrador rápido de voz clara. Estándar usa uno más grande y es la elección habitual. Alta precisión ejecuta Large v3 Turbo y maneja mejor los acentos y las salas con ruido. Máxima precisión ejecuta el Large v3 completo y comete menos errores, pero es el que más tarda.',
        'Cuanto más grande es el modelo, más tarda: Más rápido necesita menos tiempo y Máxima precisión el que más. Prueba primero Estándar y sube de nivel solo si el texto no es lo bastante bueno.',
      ],
      browser: {
        paragraphs: [
          'Más rápido usa el modelo pequeño Base y sirve para un borrador rápido de voz clara. Estándar usa uno más grande y es la elección habitual. Alta precisión ejecuta Large v3 Turbo y maneja mejor los acentos y las salas con ruido. Máxima precisión ejecuta el Large v3 completo y comete menos errores, pero es el que más tarda.',
          'El trabajo lo hace tu dispositivo, así que la velocidad depende de él: una computadora portátil reciente es mucho más rápida que un teléfono antiguo, y en un teléfono Más rápido es el nivel que conviene usar. En una computadora portátil prueba primero Estándar y sube de nivel solo si el texto no es lo bastante bueno.',
        ],
      },
    },
  ],

  howTitle: 'Cómo transcribir un video en cuatro pasos',
  howToDescription: 'Añade el video, elige el idioma y el nivel de calidad, espera mientras aparece el texto y luego edítalo y descárgalo.',
  steps: [
    {
      title: 'Añade el video',
      text: 'Suelta el archivo en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. No se acepta el enlace a un video de la web.',
    },
    {
      title: 'Elige el idioma y la calidad',
      text: 'Indica el idioma hablado si lo conoces y elige un nivel de calidad. Estándar es un buen punto de partida; usa Alta precisión o Máxima precisión para acentos, ruido o un idioma como el hindi.',
    },
    {
      title: 'Espera el texto',
      text: 'Las líneas aparecen una a una, con una barra de progreso y el tiempo restante.',
      browser: {
        text: 'Las líneas aparecen una a una, con una barra de progreso y el tiempo restante. La primera vez que usas un nivel, el modelo se descarga una sola vez; los videos siguientes empiezan al instante.',
      },
    },
    {
      title: 'Edita y descarga',
      text: 'Corrige cualquier línea en el editor y descarga TXT, SRT, VTT, PDF, Markdown o JSON. Descarga antes de irte: no se guarda nada para ti cuando termina la sesión.',
      browser: {
        text: 'Corrige cualquier línea en el editor y descarga TXT, SRT, VTT, PDF, Markdown o JSON. La transcripción permanece un tiempo en este navegador, pero descarga lo que quieras conservar.',
      },
    },
  ],

  formatsTitle: 'Videos que puedes añadir y archivos que recibes',
  formatsIntro: 'Lo que se lee es la pista de sonido, así que la imagen puede tener cualquier calidad. Los archivos solo de audio también funcionan.',
  uploadTitle: 'Archivos de video que puedes añadir',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'texto sin formato, o con la hora en cada línea' },
    { name: 'SRT', use: 'subtítulos para editores y reproductores' },
    { name: 'VTT', use: 'subtítulos para video en la web' },
    { name: 'PDF', use: 'una transcripción para imprimir o compartir' },
    { name: 'Markdown', use: 'notas con marcas de tiempo' },
    { name: 'JSON', use: 'palabras y tiempos para programadores' },
  ],

  tipsTitle: 'Cómo sacar más partido a una transcripción gratuita',
  tips: [
    {
      title: 'Prueba el primer minuto antes del video completo.',
      text: 'Corta o reproduce un minuto del video y transcríbelo. Si el texto sale mal, cambia el idioma o el nivel de calidad antes de dedicar tiempo al archivo completo.',
    },
    {
      title: 'Revisa lo que ves en pantalla además de lo que oyes.',
      text: 'Solo se escribe la voz. Los nombres que aparecen en una diapositiva pero que nadie pronuncia no estarán en el texto.',
    },
    {
      title: 'Divide una grabación muy larga.',
      text: 'Un video de varias horas es más fácil de manejar en partes de una hora más o menos: puedes empezar a leer antes y repetir un error cuesta menos.',
      browser: {
        title: 'Divide una grabación muy larga en un teléfono.',
        text: 'No hay límite de tamaño, pero un video de varias horas necesita mucha memoria. En un teléfono, las partes de una hora más o menos son mucho más seguras, y en una computadora portátil normalmente puedes aguantar bastante más.',
      },
    },
    {
      title: 'Descarga también el archivo de subtítulos, además del texto.',
      text: 'El archivo SRT conserva los tiempos, así que con la misma ejecución obtienes una transcripción para leer y subtítulos para añadir al video.',
    },
  ],

  faqs: [
    {
      question: '¿Puedo pegar un enlace de YouTube, TikTok o Google Drive en lugar de un archivo?',
      answer: 'No. Esta herramienta trabaja con un archivo que añades o grabas. Si el video es tuyo, usa el archivo original; si es de otra persona, necesitas tener derecho a usarlo.',
    },
    {
      question: '¿La transcripción indica quién está hablando?',
      answer: 'No. Las líneas tienen hora pero no nombres de hablantes. Puedes escribir los nombres en el texto desde el editor, algo rápido en una entrevista de dos personas.',
    },
    {
      question: '¿De verdad no hay límite de videos que puedo transcribir?',
      answer: 'No hay cuenta, ni plan, ni cuota diaria o mensual. {limits} Si mucha gente usa el servicio, tu video puede esperar un rato en una cola.',
      browser: {
        answer:
          'No hay cuenta, ni plan, ni cuota diaria o mensual, ni límite de tamaño. El único límite es tu dispositivo: un video muy largo tarda más y necesita más memoria, así que en un teléfono conviene usar partes de una hora más o menos. Los anuncios mantienen el sitio gratuito y no se muestra ninguno mientras se transcribe un video.',
      },
    },
    {
      question: '¿Qué nivel de calidad conviene para un video largo?',
      answer: 'Estándar es la elección habitual. Más rápido es más veloz pero comete más errores; Alta precisión y Máxima precisión cuestan más tiempo y compensan con acentos, ruido e idiomas como el hindi.',
    },
    {
      question: '¿El video sale de mi computadora?',
      answer: 'Se envía al servidor que ejecuta este sitio y se elimina cuando termina tu sesión.',
      browser: {
        answer: 'No. Tu navegador transcribe el video en tu propio dispositivo y no se envía ningún archivo a nosotros. Solo se descargan, una vez, el modelo de voz y su motor.',
      },
    },
  ],

  links: [
    {
      label: 'Herramientas gratuitas de video a texto comparadas',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Todos los límites en una tabla, citados de la página de cada herramienta.',
    },
    {
      label: 'Transcribir un video sin subirlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Cómo el trabajo se queda en tu dispositivo y cómo comprobarlo tú mismo.',
    },
    {
      label: 'Cómo transcribir un video a texto',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Cinco maneras de hacerlo y cuál se ajusta a tu video.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Hábitos y ajustes que reducen los errores en cualquier video.',
    },
  ],
};
