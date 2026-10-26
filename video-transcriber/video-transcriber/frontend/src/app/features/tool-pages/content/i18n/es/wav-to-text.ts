import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV a texto',
  h1: 'Convertir un archivo WAV a texto, gratis y con marcas de tiempo',
  lead: 'WAV es el formato de las grabadoras portátiles, de las grabadoras de llamadas y de las sesiones de estudio. Añade el tuyo y lee las palabras como texto con marcas de tiempo, gratis, sin iniciar sesión y sin comprimir antes el archivo.',
  dropKind: 'audio',
  dropNoun: 'archivo WAV',

  whyTitle: 'Por qué un archivo WAV es una buena fuente para transcribir',
  why: [
    'Un archivo WAV suele guardar el sonido sin comprimir, así que no se descartó nada al guardarlo. Eso lo convierte en una buena fuente para el reconocimiento de voz: sin artefactos de compresión y con cada consonante todavía en el archivo. No hace falta convertirlo antes a MP3. TranscribeVid lee el WAV tal cual.',
    'El precio de esa calidad es el tamaño. El sonido estéreo con calidad de CD ocupa unos 10 MB por minuto, así que una hora de audio supera el medio gigabyte. Esta página está hecha para esos archivos grandes: omite el silencio y la mayor parte del sonido que no es voz (la opción Omitir silencios y música, activada por defecto) y te da texto con una marca de tiempo en cada línea.',
  ],

  sections: [
    {
      title: 'De dónde vienen las grabaciones WAV',
      paragraphs: [
        'WAV es el formato por defecto del mundo del audio, así que el archivo que tienes delante probablemente viene de una de estas fuentes.',
      ],
      bullets: [
        {
          title: 'Grabadoras portátiles.',
          text: 'Las grabadoras portátiles que se usan para entrevistas, clases y notas de campo suelen guardar en WAV, porque conserva cada detalle del sonido.',
        },
        {
          title: 'Grabadoras de llamadas y de reuniones.',
          text: 'Las herramientas de grabación de llamadas y los sistemas de conferencia suelen exportar en WAV. Si cada lado de una llamada va en su propio canal, ambos se mezclan en una sola transcripción.',
        },
        {
          title: 'Editores de audio.',
          text: 'Programas como Audacity y Adobe Audition exportan en WAV cuando guardas o exportas un proyecto, lo que lo convierte en el archivo natural para pasar a transcribir.',
        },
        {
          title: 'Dispositivos de dictado.',
          text: 'Algunas grabadoras digitales de dictado crean archivos WAV que puedes copiar directamente del dispositivo.',
        },
      ],
    },
    {
      title: 'Frecuencia de muestreo, profundidad de bits y canales',
      paragraphs: [
        'No necesitas preparar un WAV antes de añadirlo. Se leen todos los ajustes habituales: 8, 16 o 24 bits, o coma flotante de 32 bits, mono o estéreo, a 44,1 o 48 kHz. El sonido se mezcla a mono y se convierte automáticamente para el modelo de voz.',
        'Una frecuencia de muestreo más alta no hace más precisa la transcripción, porque la voz está en la parte baja del espectro de sonido. Dónde pones el micrófono importa mucho más que los números del archivo.',
        'Mejorar el audio, en Más opciones, filtra los ruidos graves y el siseo y nivela a las personas que hablan bajo. Viene activado por defecto y se gana su sitio en una grabación hecha cerca de un ventilador, una carretera o un aire acondicionado.',
      ],
    },
  ],

  howTitle: 'Cómo convertir un archivo WAV a texto',
  howToDescription:
    'Añade el archivo WAV, elige el idioma hablado y la calidad, espera la transcripción y descárgala como texto o subtítulos.',
  steps: [
    {
      title: 'Suelta el WAV',
      text: 'Añade el archivo .wav en el cuadro de la parte superior de esta página: suéltalo allí o pulsa Elegir un archivo. Si todavía está en una grabadora, cópialo primero a tu computadora. El cuadro admite un archivo; en la página siguiente, Añadir otro archivo pone en cola más WAV, y cada uno tiene su propia transcripción.',
    },
    {
      title: 'Elige idioma y calidad',
      text: 'En la página siguiente, elige el idioma hablado o deja Detectar automáticamente si la grabación está en un solo idioma. Estándar sirve para la mayoría de las voces. Para una grabación con poco volumen o difícil, Alta precisión y Máxima precisión tardan más y cometen menos errores. Después pulsa Transcribir.',
      browser: {
        text: 'En la página siguiente, elige el idioma hablado o deja Detectar automáticamente si la grabación está en un solo idioma. Estándar sirve para la mayoría de las voces. Para una grabación con poco volumen o difícil, prueba Alta precisión o Máxima precisión si tu dispositivo las ofrece: tardan más, son una descarga inicial más grande y aparecen atenuadas, con el motivo, en un dispositivo que no puede ejecutarlas. Después pulsa Transcribir.',
      },
    },
    {
      title: 'Mira cómo aparece el texto',
      text: 'La transcripción se va llenando línea por línea, cada una con su hora. Reproduce desde cualquier línea para comprobarla con la grabación.',
    },
    {
      title: 'Edita y descarga',
      text: 'Corrige las palabras equivocadas y descarga TXT para leer, SRT o VTT para subtítulos, o PDF para imprimir. No se guarda nada cuando termina tu sesión, así que guarda lo que necesites.',
    },
  ],

  formatsTitle: 'WAV y otros formatos de audio',
  formatsIntro: 'WAV es el formato sin pérdida, y este cuadro admite también estos tipos de audio.',
  uploadTitle: 'Archivos de audio que puedes añadir',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'las palabras como texto sin formato' },
    { name: 'SRT', use: 'líneas de subtítulos con tiempos' },
    { name: 'VTT', use: 'líneas con tiempos para reproductores web' },
    { name: 'PDF', use: 'una copia para imprimir' },
    { name: 'Markdown', use: 'notas con tiempos' },
    { name: 'JSON', use: 'datos para tus propias herramientas' },
  ],

  tipsTitle: 'Consejos para transcribir grabaciones WAV',
  tips: [
    {
      title: 'Añádelo exactamente como está.',
      text: 'No se gana nada convirtiendo antes un WAV, y un MP3 de baja tasa de bits puede perder detalle. Añade el archivo tal como salió de la grabadora.',
    },
    {
      title: 'Escucha los dos canales.',
      text: 'El estéreo se mezcla a mono. Si un micrófono suena mucho más bajo o con más ruido que el otro, la mezcla lo hereda, así que revisa ambos canales en tu reproductor antes de un trabajo largo.',
    },
    {
      title: 'Recorta los silencios largos.',
      text: 'Las grabaciones de campo suelen empezar y terminar con minutos de nada. Cortarlos en un editor hace el archivo más pequeño, y la transcripción empieza donde empieza la conversación.',
    },
    {
      title: 'Divide una sesión muy larga.',
      text: 'Las grabaciones que superan el límite de tamaño o de duración se rechazan, así que divide una sesión larga en un corte natural y transcribe las partes.',
      browser: {
        title: 'Varias horas tardan varias horas.',
        text: 'El sitio no pone límite de tamaño ni de duración, pero una grabación de varias horas necesita mucho tiempo y memoria libre, y un navegador antiguo puede rechazar un archivo muy largo. En un teléfono, divídela en un corte natural y transcribe las partes.',
      },
    },
    {
      title: 'Deletrea las palabras difíciles.',
      text: 'Escribe nombres, lugares y términos técnicos en la pista de vocabulario de Más opciones, tal como quieres verlos escritos.',
    },
  ],

  faqs: [
    {
      question: '¿Puedo transcribir un WAV grabado en una llamada telefónica?',
      answer:
        'Sí, si la llamada está guardada como archivo WAV y se oye a las dos personas. Ambos canales se mezclan en una sola transcripción y no se añaden nombres de hablantes, así que escribe los nombres en el texto mientras editas. Avisa a las personas de que estás grabando y comprueba las normas de donde vives antes de grabar llamadas.',
    },
    {
      question: '¿Es WAV más preciso que MP3 para transcribir?',
      answer:
        'Puede ayudar un poco, porque no se eliminó nada del sonido. Pero un MP3 claro suele transcribirse bien y un WAV con ruido no. El micrófono, la sala y lo cerca que esté quien habla importan más que el formato del archivo.',
    },
    {
      question: '¿Por qué mi archivo WAV es tan grande, y importa?',
      answer:
        'WAV suele guardar el sonido sin comprimir: unos 10 MB por minuto en estéreo con calidad de CD. Los archivos grandes tardan más en leerse. {limits} Si un archivo supera el límite, recórtalo, o exporta una copia comprimida (M4A o MP3) y usa esa.',
      browser: {
        answer:
          'WAV suele guardar el sonido sin comprimir: unos 10 MB por minuto en estéreo con calidad de CD. Los archivos grandes tardan un poco más en leerse, pero el formato no es el problema: en las pruebas, un archivo de unos 2,5 GB se leyó sin problemas en un navegador actual. El sitio no pone límite de tamaño ni de duración porque tu propio dispositivo hace el trabajo, así que una grabación muy larga necesita tiempo y memoria libre, y un navegador antiguo puede rechazar un archivo muy largo. En un teléfono, divídela antes.',
      },
    },
    {
      question: '¿Admite archivos WAV de 24 bits y de 48 kHz?',
      answer:
        'Sí. Los ajustes habituales de WAV, como 16 o 24 bits a 44,1 o 48 kHz, se leen sin ninguna preparación, y el sonido se convierte automáticamente para el modelo de voz.',
    },
    {
      question: '¿Puedo transcribir varios archivos WAV de una vez?',
      answer:
        'Sí, en la página siguiente. El cuadro de esta página admite un archivo; allí, Añadir otro archivo pone en cola el resto. Cada archivo tiene su propia transcripción, así que un día entero de grabaciones puede ir pasando una tras otra.',
    },
  ],

  links: [
    {
      label: 'MP3 a texto',
      path: '/mp3-to-text',
      note: 'La misma transcripción gratuita para el formato comprimido en el que acaban la mayoría de las grabaciones de voz.',
    },
    {
      label: 'Transcripción de entrevistas',
      path: '/interview-transcription',
      note: 'Consejos para convertir grabaciones de entrevistas en una transcripción limpia y fácil de citar.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Qué cambiar en la grabación, el idioma y los ajustes cuando el primer resultado no es lo bastante bueno.',
    },
    {
      label: 'Grabación de reunión a texto',
      path: '/meeting-recording-to-text',
      note: 'Para llamadas de conferencia guardadas como grabación.',
    },
  ],
};
