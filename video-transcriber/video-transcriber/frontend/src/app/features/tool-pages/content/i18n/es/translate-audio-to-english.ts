import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Traducir audio al inglés',
  h1: 'Traducir audio al inglés: texto y subtítulos en inglés a partir de la voz',
  lead: 'Añade un archivo de video o de audio en otro idioma y obtén texto en inglés con marcas de tiempo, o un archivo de subtítulos en inglés. Gratis y sin iniciar sesión.',
  dropKind: 'video',
  dropNoun: 'video o audio',

  whyTitle: 'Qué hace traducir la voz al inglés',
  why: [
    'La mayoría del reconocimiento de voz escribe lo que se dijo en el idioma en que se dijo. Traducir al inglés es otro trabajo. Quien habla lo hace en hindi, español, alemán u otro idioma compatible, y el texto sale en inglés, con una marca de tiempo en cada línea. Ayuda cuando necesitas la idea general de una clase, una entrevista, una noticia o un video familiar que no puedes seguir, o subtítulos en inglés para un video que está en otro idioma.',
    'El inglés es el único idioma al que traduce. No hay traducción al francés, al hindi ni a ningún otro idioma, y no se traduce el texto escrito: solo la voz de la grabación. Esta página abre el cargador con Salida en Traducir al inglés y el idioma hablado en Detectar automáticamente.',
  ],

  sections: [
    {
      title: 'Qué fiable es el inglés y qué conviene comprobar',
      paragraphs: [
        'Traducir es más difícil que transcribir. El inglés se produce directamente a partir del sonido, sin texto escrito en el idioma original de por medio. A menudo es lo bastante bueno para seguir el sentido, pero puede acortar o reformular frases, perder modismos y chistes, y equivocarse en nombres, números y palabras técnicas.',
        'Trata el resultado como un borrador para entender, no como una traducción oficial. Para contratos, material jurídico, médico u otro material importante, recurre a un traductor humano y usa una transcripción en el idioma original como punto de partida.',
        'Un buen hábito es hacer primero una transcripción normal en el idioma original y después la versión en inglés. Donde las dos parezcan no coincidir, ese punto merece una escucha más atenta. Una transcripción terminada se conserva cuando usas Volver a transcribir, así que ambas pueden salir del mismo archivo.',
      ],
    },
    {
      title: 'Qué idiomas y qué opciones de calidad traducen bien',
      bullets: [
        {
          title: 'Cualquier idioma de la lista.',
          text: 'Más de 50 idiomas hablados, del afrikáans al galés, se pueden traducir al inglés. La calidad varía mucho y es más débil en los idiomas que tienen poca voz grabada de la que aprender. Si la voz ya está en inglés, no necesitas esta página: usa las páginas de video a texto o de audio a texto.',
        },
        {
          title: 'Indica el idioma o deja que se detecte.',
          text: 'Deja Idioma en Detectar automáticamente cuando no estés seguro de qué se habla. Si lo sabes, elegirlo es más fiable, sobre todo en clips cortos o con acento.',
        },
        {
          title: 'Evita Alta precisión para traducir.',
          text: 'Alta precisión ejecuta el modelo Large v3 Turbo. OpenAI, que creó Whisper, dice que Turbo no está entrenado para traducir y devuelve el idioma original aunque se pida traducción. Distil Large v3, en la lista Modelo de Más opciones, es solo para inglés. Para traducir, empieza con Estándar y elige Máxima precisión (Large v3) para voz difícil. Medium, que también está en esa lista Modelo, es otra buena opción.',
          browser: {
            text: 'Alta precisión ejecuta el modelo Large v3 Turbo. OpenAI, que creó Whisper, dice que Turbo no está entrenado para traducir y devuelve el idioma original aunque se pida traducción. Distil Large v3, en la lista Modelo de Más opciones, es solo para inglés. Para traducir, empieza con Estándar y elige Máxima precisión (Large v3) para voz difícil si tu dispositivo la ofrece. Medium, que también está en esa lista Modelo, es otra buena opción.',
          },
        },
        {
          title: 'Solo Whisper.',
          text: 'Traducir necesita el motor de reconocimiento Whisper. La opción experimental Qwen3 ASR no puede traducir: Traducir al inglés no está disponible mientras está seleccionada, y elegirla vuelve a poner Salida en Transcribir.',
        },
        {
          title: 'Sin estilo de transcripción.',
          text: 'La opción Estilo de la transcripción (Hinglish o Escritura original) no se aplica a una traducción y aparece en gris mientras está seleccionado Traducir al inglés.',
        },
      ],
    },
    {
      title: 'Qué hace la gente con subtítulos y texto en inglés',
      bullets: [
        {
          title: 'Subtítulos para tu propio video.',
          text: 'Descarga SRT o VTT. Las líneas en inglés están sincronizadas con la voz original, así que se pueden añadir al mismo video en un reproductor o en un editor.',
        },
        {
          title: 'Entender una grabación.',
          text: 'Lee de qué trata una entrevista, una clase o un reportaje antes de decidir si necesita una traducción en condiciones.',
        },
        {
          title: 'Investigación y periodismo.',
          text: 'Un borrador en inglés te ayuda a decidir qué pasajes hay que traducir con cuidado y cuáles citar del idioma original.',
        },
      ],
    },
  ],

  howTitle: 'Cómo traducir voz al inglés',
  howToDescription:
    'Añade un archivo de video o de audio en otro idioma, comprueba que Traducir al inglés está seleccionado, espera el texto en inglés y descárgalo.',
  steps: [
    {
      title: 'Añade tu grabación',
      text: 'Suelta tu grabación en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. Llegas al cargador con Más opciones abierto, Salida en Traducir al inglés e Idioma en Detectar automáticamente. Elige el idioma hablado si lo conoces.',
    },
    {
      title: 'Elige la calidad y pulsa Transcribir',
      text: 'Estándar es un buen comienzo. Para voz con acento, con ruido o técnica, elige Máxima precisión, que tarda más y suele cometer menos errores. No elijas Alta precisión para una traducción: usa un modelo que no fue entrenado para traducir. Después pulsa Transcribir.',
      browser: {
        text: 'Estándar es un buen comienzo. Para voz con acento, con ruido o técnica, elige Máxima precisión si tu dispositivo la ofrece (una opción que no puede ejecutar aparece en gris, con el motivo); es una primera descarga grande, tarda más y suele cometer menos errores. No elijas Alta precisión para una traducción: usa un modelo que no fue entrenado para traducir. Después pulsa Transcribir.',
      },
    },
    {
      title: 'Espera el texto en inglés',
      text: 'Las líneas en inglés aparecen con sus tiempos. Estilo de la transcripción aparece en gris porque solo se aplica a las transcripciones, no a las traducciones.',
    },
    {
      title: 'Comprueba y descarga',
      text: 'Lee las líneas marcadas como dudosas, compara nombres y números con el audio y después descarga TXT, SRT o VTT, o un archivo PDF, Markdown o JSON.',
    },
  ],

  formatsTitle: 'Archivos de entrada, texto en inglés de salida',
  formatsIntro:
    'Funcionan video y audio en muchos formatos, sea cual sea el idioma hablado. Los archivos que descargas contienen el texto en inglés.',
  uploadTitle: 'Archivos que puedes añadir',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'texto en inglés para leer' },
    { name: 'SRT', use: 'subtítulos en inglés sincronizados con la voz' },
    { name: 'VTT', use: 'subtítulos en inglés para un reproductor web' },
    { name: 'PDF', use: 'una copia imprimible' },
    { name: 'Markdown', use: 'texto con títulos y tiempos' },
    { name: 'JSON', use: 'líneas y tiempos para tus propias herramientas' },
  ],

  tipsTitle: 'Consejos para mejores traducciones',
  tips: [
    {
      title: 'Indica el idioma hablado cuando lo conozcas.',
      text: 'La detección automática va bien con voz clara, pero un error en un clip corto da una mala traducción.',
    },
    {
      title: 'Mantén los clips en un solo idioma.',
      text: 'Una grabación que cambia constantemente de idioma puede confundir la traducción. Divídela o haz antes una transcripción normal para ver qué se oyó.',
    },
    {
      title: 'Comprueba números, nombres y fechas.',
      text: 'Son los detalles que más importan y los que más se equivocan en un borrador traducido.',
    },
    {
      title: 'Prueba el primer minuto.',
      text: 'Lee el primer minuto de inglés frente al audio antes de fiarte de todo el archivo.',
    },
    {
      title: 'Conserva el original junto al inglés.',
      text: 'Si publicas una cita, conserva la transcripción en el idioma original junto a la versión en inglés.',
    },
  ],

  faqs: [
    {
      question: '¿Puede traducir la voz a idiomas distintos del inglés?',
      answer:
        'No. El inglés es el único idioma al que traduce. Para leer la voz en su propio idioma, haz una transcripción normal.',
    },
    {
      question: '¿Por qué una transcripción traducida es menos exacta que una normal?',
      answer:
        'Traducir es una tarea más difícil que escribir las palabras. La voz tiene que entenderse y expresarse de nuevo en un solo paso, así que se pueden acortar frases, perder modismos y chistes y oír mal los nombres. Comprueba cualquier cosa importante con el audio o con una transcripción en el idioma original.',
    },
    {
      question: '¿Por qué mi traducción salió en el idioma original?',
      answer:
        'La causa probable es la opción de calidad. Alta precisión ejecuta el modelo Large v3 Turbo, que no fue entrenado para traducir y tiende a escribir el idioma original. Empieza de nuevo con Estándar o Máxima precisión y comprueba que Salida está en Traducir al inglés.',
    },
    {
      question: '¿Puedo obtener subtítulos en inglés para un video en otro idioma?',
      answer:
        'Sí. Después de la traducción, descarga SRT o VTT. Las líneas en inglés llevan los tiempos de la voz original. Léelas completas antes de publicar y recuerda que la traducción es un borrador.',
    },
    {
      question: '¿Por qué no puedo elegir Traducir al inglés?',
      answer:
        'No está disponible para el motor experimental Qwen3 ASR. Vuelve a poner Motor de reconocimiento en Whisper en Más opciones y la opción regresa.',
    },
  ],

  links: [
    {
      label: 'Audio en hindi a texto',
      path: '/hindi-audio-to-text',
      note: 'Lee la voz en hindi en su propio idioma antes de traducirla.',
    },
    {
      label: 'Audio en español a texto',
      path: '/spanish-audio-to-text',
      note: 'Haz una transcripción en español con acentos, sin traducirla.',
    },
    {
      label: 'Generador de subtítulos para YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Crea un SRT para tu propio video y súbelo en YouTube Studio.',
    },
    {
      label: 'Cómo añadir subtítulos a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Qué hacer con el archivo SRT o VTT una vez que lo tienes.',
    },
  ],
};
