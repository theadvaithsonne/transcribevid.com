import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Nota de voz de WhatsApp a texto',
  h1: 'Convierte una nota de voz de WhatsApp en texto',
  lead: 'Las notas de voz largas son fáciles de enviar y difíciles de volver a leer. Guarda la nota como archivo, suéltala aquí y léela como texto con marcas de tiempo, en hindi, inglés, español y muchos otros idiomas. Gratis y sin iniciar sesión.',
  dropKind: 'audio',
  dropNoun: 'nota de voz de WhatsApp',

  whyTitle: 'Por qué convertir una nota de voz en texto',
  why: [
    'Una nota de voz se graba rápido y se aprovecha despacio. No puedes buscar en ella, copiar una frase ni echarle un vistazo durante una reunión. Como texto, la misma nota se repasa en segundos y puedes pegar una dirección, una cita o una lista de instrucciones directamente en un chat, una nota o un documento.',
    'Usa esta página para notas que enviaste o recibiste y que puedes usar libremente. Las notas de voz son personales, así que conviene saber adónde va el archivo: aquí viaja al servidor por una conexión cifrada y se elimina automáticamente después. No hace falta una cuenta.',
  ],
  browserWhy: [
    'Una nota de voz se graba rápido y se aprovecha despacio. No puedes buscar en ella, copiar una frase ni echarle un vistazo durante una reunión. Como texto, la misma nota se repasa en segundos y puedes pegar una dirección, una cita o una lista de instrucciones directamente en un chat, una nota o un documento.',
    'Usa esta página para notas que enviaste o recibiste y que puedes usar libremente. Las notas de voz son personales, así que el archivo se queda contigo: tu navegador lo transcribe en tu propio dispositivo y no se sube nada. La primera vez que usas el sitio, tu navegador descarga el modelo de voz una sola vez y lo conserva. Son decenas de megabytes para Más rápido, unos cientos para Estándar y más para las opciones más grandes, así que en un teléfono usa Wi-Fi en lugar de datos móviles. No hace falta una cuenta.',
  ],

  sections: [
    {
      title: 'Cómo guardar una nota de voz como archivo',
      paragraphs: [
        'WhatsApp guarda las notas de voz dentro de la aplicación, así que primero guarda la nota como archivo. Los menús cambian según el modelo de teléfono y la versión de la aplicación, así que toma estos pasos como una guía y busca las opciones Compartir, Reenviar o Guardar. WhatsApp pertenece a su propia empresa y este sitio no tiene relación con ella.',
        'En algunos teléfonos, WhatsApp también puede mostrar una transcripción dentro del chat, en los idiomas y versiones que la ofrecen. Esta página sirve para cuando quieres el texto como un archivo que puedas editar y exportar, con marcas de tiempo, o cuando tu versión o tu idioma no están cubiertos.',
      ],
      bullets: [
        {
          title: 'En Android.',
          text: 'Mantén pulsada la nota de voz, abre el menú y busca Compartir, o Reenviar y luego Compartir. Elige Guardar en el dispositivo, Archivos o una aplicación de almacenamiento en la nube, o envíatela por correo electrónico. Muchos teléfonos Android también guardan las notas de voz recibidas en una carpeta WhatsApp Voice Notes que se puede abrir con un administrador de archivos.',
        },
        {
          title: 'En iPhone.',
          text: 'Mantén pulsada la nota de voz, elige Reenviar, toca el icono de compartir y elige Guardar en Archivos. También puedes enviarla a tu computadora con AirDrop o por correo electrónico.',
        },
        {
          title: 'En una computadora.',
          text: 'En WhatsApp Web o en la aplicación de escritorio, el menú del mensaje puede ofrecer una opción Descargar. Si no la ofrece, guarda el archivo en tu teléfono y pásalo a la computadora.',
        },
      ],
    },
    {
      title: 'Mensajes en hindi, hinglish y en varios idiomas',
      paragraphs: [
        'Las notas de voz suelen mezclar idiomas en una misma frase. Configura el idioma que más se habla o deja Detectar automáticamente. El reconocimiento sigue mejor el idioma principal, así que revisa las líneas marcadas como dudosas donde entra un segundo idioma.',
        'Para el hindi, el Estilo de la transcripción decide cómo se escribe el texto. Hinglish (hindi romanizado) escribe el hindi con letras latinas y deja las palabras en inglés tal cual. Escritura original conserva el devanagari. El urdu, el bengalí, el árabe, el español, el portugués y los demás idiomas compatibles conservan su propia escritura. Un mensaje en otro idioma también puede salir como texto en inglés: en Más opciones, cambia Salida a Traducir al inglés y comprueba el resultado con la grabación, porque la traducción es menos fiable que transcribir en el idioma original.',
      ],
    },
  ],

  howTitle: 'Cómo convertir una nota de voz de WhatsApp en texto',
  howToDescription:
    'Guarda la nota de voz como archivo, añádela a la página, elige el idioma, espera la transcripción y copia o descarga el texto.',
  steps: [
    {
      title: 'Añade el archivo de la nota de voz',
      text: 'Suelta el archivo guardado en el cuadro de arriba o pulsa Elegir un archivo. Una nota de voz de WhatsApp suele ser un archivo .opus y funciona tal cual. El cuadro acepta un archivo cada vez: pasa la nota al cargador de la página siguiente, donde Añadir otro archivo te permite incluir más notas.',
    },
    {
      title: 'Elige el idioma',
      text: 'En la página siguiente, elige el idioma que más se habla o deja Detectar automáticamente. Para el hindi, el Estilo de la transcripción permite elegir entre letras latinas (Hinglish) y devanagari. Después pulsa Transcribir.',
    },
    {
      title: 'Espera el texto',
      text: 'Las líneas aparecen con sus marcas de tiempo mientras se procesa la nota, y una nota corta termina antes que una larga. Estándar sirve para la mayoría de las notas. Con un hablante rápido o una grabación con ruido, Alta precisión puede ayudar si tu dispositivo puede ejecutarla. En un dispositivo que no puede, la opción aparece en gris con el motivo, y requiere una primera descarga más grande.',
    },
    {
      title: 'Revisa, copia o descarga',
      text: 'Corrige los nombres y las palabras poco claras, y luego copia el texto o descarga TXT. Descarga SRT o VTT solo si la nota va junto con un video.',
    },
  ],

  formatsTitle: 'Archivos de notas de voz y descargas',
  formatsIntro:
    'Las notas de voz de WhatsApp suelen ser archivos .opus. Otros archivos de audio funcionan igual, y también se aceptan archivos de video, de los que solo se usa el sonido.',
  uploadTitle: 'Archivos de audio que puedes añadir',
  accepts: ['OPUS', 'OGG', 'M4A', 'MP3', 'AAC', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'la nota como texto plano para copiar' },
    { name: 'Markdown', use: 'apuntes con la hora en cada línea' },
    { name: 'PDF', use: 'una copia imprimible de la nota' },
    { name: 'SRT', use: 'líneas con tiempos para un video que lleva la nota' },
  ],

  tipsTitle: 'Consejos para notas de voz',
  tips: [
    {
      title: 'Guarda el archivo, no vuelvas a grabarlo.',
      text: 'Reproducir una nota por el altavoz mientras otro dispositivo la graba añade eco y ruido de la habitación. El archivo guardado es la copia limpia.',
    },
    {
      title: 'Indica el idioma principal.',
      text: 'Elegir el idioma es más fiable que la detección automática en una nota corta, sobre todo cuando quien habla cambia entre dos idiomas.',
    },
    {
      title: 'Añade nombres a la pista de vocabulario.',
      text: 'En Más opciones, escribe los nombres de personas, lugares y tiendas que se mencionan. Así es más probable que se escriban como esperas.',
    },
    {
      title: 'Comprueba los números antes de actuar.',
      text: 'Un número de teléfono, una dirección, una hora o una cantidad pueden oírse mal. Reproduce esa línea desde su marca de tiempo y escúchala de nuevo antes de fiarte de ella.',
    },
    {
      title: 'Trata con cuidado los mensajes de otras personas.',
      text: 'Transcribe solo mensajes que enviaste o recibiste y que puedes usar libremente, y piénsalo antes de compartir el texto de un mensaje que alguien te envió en privado.',
    },
  ],

  faqs: [
    {
      question: '¿Puedo convertir una nota de voz de WhatsApp en texto sin la aplicación?',
      answer:
        'Sí. Guarda la nota de voz como archivo, añádela a esta página y lee el texto. No necesitas una cuenta en este sitio y no hay registro ni inicio de sesión.',
    },
    {
      question: '¿Qué tipo de archivo es una nota de voz de WhatsApp?',
      answer:
        'Normalmente un archivo .opus. Esta página lo lee directamente, así que no necesitas convertirlo a MP3 antes. Las notas de voz guardadas como OGG, M4A, MP3 o AAC también funcionan.',
    },
    {
      question: '¿Funciona con hindi o con una mezcla de hindi e inglés?',
      answer:
        'Sí. El hindi es uno de los idiomas compatibles. De forma predeterminada el texto se escribe con letras latinas (Hinglish); elige Escritura original en Estilo de la transcripción para el devanagari. Un mensaje que mezcla idiomas sigue mejor el principal, así que revisa las líneas marcadas como dudosas.',
    },
    {
      question: '¿Qué duración puede tener la nota de voz de WhatsApp que transcribo?',
      answer:
        '{limits} Las notas de voz suelen ser cortas, así que esto rara vez importa. No hay cuota diaria ni mensual.',
      browser: {
        answer:
          'El sitio no establece ningún límite de tamaño ni de duración, y las notas de voz suelen ser cortas, así que terminan rápido. Una grabación muy larga necesita tiempo y memoria libre en tu dispositivo, y algunos navegadores pueden no poder con un archivo extremadamente largo.',
      },
    },
    {
      question: '¿Guarda este sitio una copia de mi nota de voz de WhatsApp?',
      answer:
        'Solo durante tu sesión. El servidor elimina el archivo cuando termina la sesión o cuando pulsas Borrar mis datos ahora.',
      browser: {
        answer:
          'Solo en este navegador: la nota de voz nunca sale de tu dispositivo. Tu navegador la borra tras un periodo de inactividad y puedes borrarla antes con Borrar mis datos ahora.',
      },
    },
  ],

  links: [
    {
      label: 'Audio en hindi a texto',
      path: '/hindi-audio-to-text',
      note: 'Ajustes y consejos para el habla en hindi, en devanagari o con letras latinas.',
    },
    {
      label: 'Transcriptor de hinglish',
      path: '/hinglish-transcription',
      note: 'Cómo se escribe el hindi con letras latinas y cuándo usarlo.',
    },
    {
      label: 'Traducir voz a texto en inglés',
      path: '/translate-audio-to-english',
      note: 'Obtén texto en inglés a partir de una nota de voz en otro idioma.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Qué cambiar cuando una nota sale con errores.',
    },
  ],
};
