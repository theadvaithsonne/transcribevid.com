import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Generador de transcripciones de podcast',
  h1: 'Genera la transcripción de un podcast a partir de tu archivo de audio',
  lead: 'Suelta un episodio y obtén una transcripción completa, con marcas de tiempo, para publicarla junto a él, buscar en ella, citarla o convertirla en notas del episodio. Gratis, sin registro y disponible en más de 50 idiomas.',
  dropKind: 'audio',
  dropNoun: 'episodio del podcast',

  whyTitle: 'Por qué dar una transcripción a un episodio',
  why: [
    'Una transcripción hace que un episodio sea más fácil de encontrar, citar y seguir. Los oyentes pueden leerla por encima, seguir el texto sin sonido o en un lugar ruidoso y buscar en ella el nombre de un invitado. También la pueden usar las personas sordas o con dificultades auditivas y quienes escuchan en un segundo idioma. Además, los motores de búsqueda leen el texto con mucha más facilidad que el audio.',
    'Esta página genera el primer borrador: el episodio completo como texto, con la hora en cada línea. Cuenta con editarlo. El reconocimiento de voz no conoce los nombres de tus invitados ni la jerga de tu programa, y no etiqueta a quien habla. Úsala con episodios que hayas hecho tú o que tengas permiso para usar.',
  ],

  sections: [
    {
      title: 'De la transcripción a la página del episodio',
      paragraphs: ['Una misma transcripción puede alimentar varias cosas que ya publicas.'],
      bullets: [
        {
          title: 'Notas del episodio.',
          text: 'Lee la transcripción una vez, elige los temas y escribe un resumen breve con la marca de tiempo de cada uno. Descarga Markdown para pegarlo en una aplicación de notas o en un editor de blog.',
        },
        {
          title: 'Una transcripción bajo el reproductor.',
          text: 'Descarga TXT, ordena los párrafos y añade a mano nombres como Presentador e Invitado. La transcripción no tiene etiquetas de quien habla por sí misma.',
        },
        {
          title: 'Subtítulos para una versión en video.',
          text: 'Si además publicas el episodio como video, descarga SRT o VTT y súbelo como subtítulos.',
        },
        {
          title: 'Citas y fragmentos.',
          text: 'Encuentra la línea, lee su marca de tiempo y corta el fragmento de tu audio en ese momento.',
        },
      ],
    },
    {
      title: 'Acertar con nombres, jerga y menciones publicitarias',
      paragraphs: [
        'Los nombres de invitados, de marcas y los términos del programa son lo que más se le escapa a un reconocedor. Antes de empezar, enuméralos en la pista de vocabulario de Más opciones: el presentador, los invitados, el nombre del programa, los productos y cualquier término que uses a menudo. Cuando la transcripción esté lista, escribe un nombre mal escrito en el cuadro Buscar en el texto que hay encima, abre Reemplazar…, escribe la grafía correcta y aplícala a todas las líneas que coinciden a la vez. Las líneas de las que el reconocedor no estaba seguro están marcadas, así que revísalas primero.',
        'Deja activado el interruptor Omitir silencios y música en Más opciones, para que las sintonías y las pausas largas no se conviertan en palabras inventadas. Los efectos de sonido y la música de fondo bajo una mención publicitaria todavía pueden añadir texto suelto, así que borra cualquier cosa que no se haya dicho.',
      ],
    },
  ],

  howTitle: 'Cómo generar la transcripción de un podcast',
  howToDescription:
    'Añade el episodio, enumera los nombres y los términos, espera la transcripción y descárgala para la página del episodio.',
  steps: [
    {
      title: 'Añade el episodio',
      text: 'Suelta el episodio en el cuadro de arriba o pulsa Elegir un archivo. MP3 es el formato habitual de los podcasts, pero WAV, M4A, FLAC y otros también sirven. En este cuadro entra un episodio cada vez; en la página siguiente, Añadir otro archivo te permite incluir más episodios.',
    },
    {
      title: 'Enumera los nombres y los términos',
      text: 'En la página siguiente, abre Más opciones y pon en la pista de vocabulario al presentador, a los invitados, el nombre del programa y cualquier jerga. Elige el idioma hablado o deja Detectar automáticamente.',
    },
    {
      title: 'Empieza y espera la transcripción',
      text: 'Pulsa Transcribir. El texto aparece línea a línea con una barra de progreso. Estándar sirve para la mayoría de los episodios. Cuando hay voces superpuestas o mal audio es donde Alta precisión o Máxima precisión compensan el tiempo. Son más lentas, requieren una primera descarga más grande y aparecen en gris con un motivo en un dispositivo que no puede ejecutarlas.',
    },
    {
      title: 'Edita y exporta',
      text: 'Corrige nombres y puntuación y añade a mano los nombres de quienes hablan. Después descarga TXT o Markdown para la página del episodio, o SRT o VTT para una versión en video.',
    },
  ],

  formatsTitle: 'Archivos de podcast y descargas',
  formatsIntro:
    'MP3 es el formato habitual de los podcasts. Otros archivos de audio se leen de la misma manera, y también se aceptan archivos de video.',
  uploadTitle: 'Archivos de audio que puedes añadir',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'la transcripción para publicar bajo el reproductor' },
    { name: 'Markdown', use: 'notas del episodio con marcas de tiempo' },
    { name: 'SRT', use: 'subtítulos para una versión en video' },
    { name: 'VTT', use: 'una pista de transcripción para reproductores web' },
    { name: 'PDF', use: 'una transcripción para compartir o imprimir' },
  ],

  tipsTitle: 'Consejos para transcripciones de podcast',
  tips: [
    {
      title: 'Transcribe la mezcla final.',
      text: 'El episodio masterizado, con la intro y las menciones publicitarias, es lo que oyen los oyentes. Así sus marcas de tiempo coinciden con el archivo que publicas.',
    },
    {
      title: 'Usa tu WAV original cuando lo tengas.',
      text: 'Un MP3 es una copia comprimida, y cada ronda extra de compresión pierde detalle. Un audio más limpio da menos errores.',
    },
    {
      title: 'Corta los episodios muy largos en partes.',
      text: 'Un archivo más grande o más largo que los límites que se muestran en esta página no se puede procesar, así que divide antes un episodio largo con cualquier editor de audio.',
      browser: {
        title: 'Los episodios largos tardan más.',
        text: 'El sitio no pone tope a la duración del episodio, pero un programa largo de conversación necesita tiempo y memoria libre en tu dispositivo. Dividirlo en una pausa natural con cualquier editor de audio te da antes la primera parte.',
      },
    },
    {
      title: 'Lee mientras escuchas, una vez.',
      text: 'Leer la transcripción mientras el episodio suena a velocidad normal es la forma más rápida de detectar los errores que importan.',
    },
    {
      title: 'Di que es automática.',
      text: 'Si publicas una transcripción sin una edición completa, dilo, para que los lectores sepan que puede haber pequeños errores.',
    },
  ],

  faqs: [
    {
      question:
        '¿Puedo publicar la transcripción automática de un podcast en la página de mi episodio?',
      answer:
        'Sí, de un episodio que hiciste tú. Léela primero, corrige los nombres, añade a mano los nombres de quienes hablan e informa a los lectores de que se hizo automáticamente. Si un invitado pidió que se omitiera algo, quítalo también del texto.',
    },
    {
      question: '¿La transcripción del podcast incluye los nombres de quienes hablan?',
      answer:
        'No. Escribe «Presentador» e «Invitado» en el texto mientras editas; la transcripción en sí solo lleva horas.',
    },
    {
      question: '¿Puedo obtener notas del episodio a partir de la transcripción de un podcast?',
      answer:
        'Obtienes la materia prima, no un resumen. La transcripción no escribe las notas del episodio por ti, pero sus marcas de tiempo hacen rápido enumerar los temas y el minuto en que empieza cada uno.',
    },
    {
      question: '¿Qué duración puede tener el episodio de podcast que transcribo de una vez?',
      answer:
        '{limits} Un episodio largo puede necesitar dividirse. No hay cuota diaria ni mensual.',
      browser: {
        answer:
          'El sitio no pone tope a la duración del episodio. Un episodio largo tarda más y necesita memoria libre en tu propio dispositivo; la página te avisa en uno más lento.',
      },
    },
    {
      question: '¿Puedo transcribir un podcast desde su canal RSS o un enlace?',
      answer:
        'No. TranscribeVid trabaja con archivos que añades, no con enlaces web ni canales. Usa el archivo del episodio que hiciste o exportaste y añádelo en el cuadro de la parte superior de esta página.',
    },
  ],

  links: [
    {
      label: 'MP3 a texto',
      path: '/mp3-to-text',
      note: 'Ajustes y consejos para el tipo de archivo de podcast más habitual.',
    },
    {
      label: 'Generador de subtítulos SRT',
      path: '/srt-subtitle-generator',
      note: 'Subtítulos para una versión en video del episodio.',
    },
    {
      label: 'SRT frente a VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Qué archivo de subtítulos espera tu reproductor o tu plataforma de alojamiento.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Menos errores con el mismo episodio.',
    },
  ],
};
