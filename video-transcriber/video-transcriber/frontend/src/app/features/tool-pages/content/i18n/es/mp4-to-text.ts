import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 a texto',
  h1: 'Convertir un video MP4 a texto',
  lead: 'MP4 es el formato de las cámaras de los teléfonos, los grabadores de pantalla y las exportaciones de reuniones. Sube el tuyo y obtén una transcripción con marcas de tiempo, gratis y sin iniciar sesión.',
  dropKind: 'video',
  dropNoun: 'archivo MP4',

  whyTitle: 'Por qué los archivos MP4 son fáciles de transcribir',
  why: [
    'Un MP4 es un contenedor: guarda juntos la imagen y el sonido. TranscribeVid lee el sonido e ignora la imagen, así que no hay nada que convertir antes ni hace falta un paso aparte de MP4 a MP3.',
    'Va bien con grabaciones que ya vienen en MP4, como videos del teléfono, reuniones de Zoom o Teams guardadas, capturas de pantalla, seminarios web y grabaciones de clases. El resultado es texto con la hora en cada línea, listo para buscar o convertir en subtítulos.',
  ],

  howTitle: 'Cómo convertir un MP4 a texto',
  howToDescription:
    'Sube el MP4, elige el idioma hablado y la calidad, espera la transcripción y descárgala.',
  steps: [
    {
      title: 'Localiza el MP4',
      text: 'Busca el archivo .mp4 en tu teléfono o tu computadora. No necesitas comprimirlo ni recortarlo, salvo que supere el límite.',
      browser: {
        text: 'Busca el archivo .mp4 en tu teléfono o tu computadora. No necesitas comprimirlo ni recortarlo antes.',
      },
    },
    {
      title: 'Súbelo',
      text: 'Suelta el MP4 en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. En el cargador se pueden poner en cola varios archivos MP4 a la vez.',
      browser: {
        title: 'Añádelo',
        text: 'Suelta el MP4 en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. En el cargador puedes añadir varios archivos MP4; se transcriben uno tras otro.',
      },
    },
    {
      title: 'Elige idioma y calidad',
      text: 'Elige el idioma hablado. Se recomienda Estándar. Alta precisión y Máxima precisión son más lentas y cometen menos errores, y Más rápido es veloz con voces claras.',
    },
    {
      title: 'Descarga el resultado',
      text: 'Obtén TXT para leer, SRT o VTT para usar como subtítulos con el mismo MP4, o un PDF para imprimir.',
    },
  ],

  formatsTitle: 'MP4 y otros formatos de video',
  formatsIntro:
    'MP4 es el caso habitual, pero la misma carga acepta estos tipos de video y también los formatos de audio de siempre.',
  uploadTitle: 'Archivos de video que puedes subir',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'las palabras habladas como texto sin formato' },
    { name: 'SRT', use: 'un archivo de subtítulos para el mismo MP4' },
    { name: 'VTT', use: 'subtítulos para una página web' },
    { name: 'PDF', use: 'una transcripción para imprimir o compartir' },
    { name: 'Markdown', use: 'notas con tiempos' },
    { name: 'JSON', use: 'datos para tus propias herramientas' },
  ],

  tipsTitle: 'Consejos para transcribir archivos MP4',
  tips: [
    {
      title: 'Comprueba que hay sonido.',
      text: 'Una grabación de pantalla hecha sin audio no tiene voz que transcribir y da un resultado vacío.',
    },
    {
      title: 'Cuidado con el viento y la sala.',
      text: 'Los videos del teléfono sufren por el viento, la distancia y el eco. Acerca el teléfono o usa un micrófono externo la próxima vez.',
    },
    {
      title: 'Reduce los archivos grandes exportando solo el audio.',
      text: 'Si un MP4 supera el límite, exporta solo el audio (M4A o MP3) desde tu editor. Es mucho más pequeño y funciona igual.',
      browser: {
        text: 'Un MP4 muy largo necesita mucha memoria en un teléfono. Exporta solo el audio (M4A o MP3) desde tu editor: es mucho más pequeño y funciona igual.',
      },
    },
    {
      title: 'Guarda el SRT junto al video.',
      text: 'Muchos reproductores cargan un archivo .srt automáticamente cuando tiene el mismo nombre que el video.',
    },
    {
      title: 'Revisa nombres y números.',
      text: 'Las transcripciones automáticas se equivocan sobre todo en esto. Buscar y reemplazar corrige las repeticiones de una vez.',
    },
  ],

  faqs: [
    {
      question: '¿Tengo que convertir primero el MP4 a MP3?',
      answer: 'No. Sube el MP4 tal cual. El sonido se lee del archivo por ti.',
    },
    {
      question: '¿Por qué se rechazó mi MP4?',
      answer:
        'Los archivos que superan el límite de tamaño o de duración se rechazan antes de procesarlos. {limits} Divide el video en partes, o exporta solo su audio, y vuelve a subirlo.',
      browser: {
        question: '¿Por qué no funcionó mi MP4?',
        answer:
          'Tu navegador no pudo leer su sonido: el archivo puede estar dañado, no tener pista de sonido o usar un formato de audio poco común. Exporta el audio como M4A o MP3 desde tu editor y añade ese archivo en su lugar. No hay límite de tamaño ni de duración, pero los videos muy largos necesitan suficiente memoria libre.',
      },
    },
    {
      question: '¿Puedo añadir subtítulos a mi MP4 con esto?',
      answer:
        'Obtienes un archivo de subtítulos (SRT o VTT) sincronizado con la voz. TranscribeVid no edita ni recodifica tu MP4, así que para incrustar los subtítulos en la imagen necesitas un editor de video.',
    },
    {
      question: '¿Puedo pegar un enlace en lugar de subir un archivo?',
      answer:
        'No. TranscribeVid trabaja con archivos que subes o grabas, no con enlaces web. Si el video es tuyo, sube el archivo original.',
    },
    {
      question: '¿Funciona con videos de Zoom, Teams y del teléfono?',
      answer:
        'Sí, funciona cualquier MP4 con voz. No se añaden nombres de hablantes en las reuniones, pero las líneas llevan marca de tiempo para que puedas añadir los nombres mientras editas.',
    },
  ],
};
