import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Clase a texto',
  h1: 'Transcribir una clase a texto: convierte una grabación en una transcripción donde puedes buscar',
  lead: 'Graba la clase, suelta el archivo aquí y léela como texto con marcas de tiempo: algo en lo que puedes buscar un tema de examen, copiarlo a tus apuntes y comprobarlo con la grabación. Sin cuenta, sin coste y con más de 50 idiomas.',
  dropKind: 'video',
  dropNoun: 'grabación de la clase',

  whyTitle: 'Por qué transcribir una clase',
  why: [
    'Asistir a una clase es fácil; repasar a partir de ella, difícil. No puedes buscar en una grabación la definición que necesitas, y volver a reproducir una hora para encontrarla lleva tanto como duró la clase. Una transcripción te da las palabras en orden, con la hora junto a cada línea, para que puedas saltar a la parte que necesitas.',
    'También ayuda a quienes leen con más facilidad de lo que escuchan, a quienes estudian en un segundo idioma, a quienes faltaron a una clase o a quienes quieren el texto de una charla que dieron ellos mismos. Pregunta a tu profesor antes de grabar y sigue las normas de tu institución sobre las grabaciones.',
  ],

  sections: [
    {
      title: 'De la transcripción a los apuntes de estudio',
      paragraphs: [
        'Una transcripción es materia prima, no unos apuntes terminados. Estas son cuatro formas en que la usan los estudiantes.',
      ],
      bullets: [
        {
          title: 'Busca antes de repasar.',
          text: 'Cuando la transcripción esté terminada, escribe un término en el cuadro Buscar en el texto que hay encima. El cuadro cuenta las líneas que coinciden y las flechas pasan de una a otra, así que puedes reproducir cada una desde su marca de tiempo y volver a oír la explicación. Si una palabra técnica salió mal escrita en todas partes, Reemplazar… la corrige en todas las líneas a la vez.',
        },
        {
          title: 'Crea tu propio esquema.',
          text: 'Lee el texto una vez, añade tus propios títulos y reduce lo que necesites. Poner una idea con tus propias palabras suele ser mejor forma de aprenderla que copiarla.',
        },
        {
          title: 'Comprueba nombres, números y fórmulas.',
          text: 'El reconocimiento de voz escribe lo que oye. Las ecuaciones, los símbolos y los términos poco comunes suelen necesitar corrección, así que compruébalos con las diapositivas y la grabación.',
        },
        {
          title: 'Haz una lista de lo que no entendiste.',
          text: 'Copia en una lista las marcas de tiempo de las partes en las que te perdiste y llévala a tu próxima tutoría u horario de consulta.',
        },
      ],
    },
    {
      title: 'Vocabulario técnico y otros idiomas',
      paragraphs: [
        'Las palabras de la materia son las más difíciles para cualquier reconocedor de voz. Antes de empezar, abre Más opciones y enumera en la pista de vocabulario los términos, los nombres de teorías y autores y las abreviaturas. Así la transcripción los escribe con más frecuencia como los escribiste.',
        'Si estudias en un idioma que no es el tuyo, una transcripción te da texto para leer a tu ritmo y para buscar palabras. Elige el idioma de la clase o deja Detectar automáticamente. Una clase en otro idioma también se puede convertir en texto en inglés: en Más opciones, pon Salida en Traducir al inglés. La traducción es menos fiable que transcribir en el idioma original y puede perder términos técnicos, así que compruébala con la grabación.',
      ],
    },
  ],

  howTitle: 'Cómo convertir una clase en texto',
  howToDescription:
    'Añade la grabación de la clase, define el idioma y los términos técnicos, espera la transcripción y descárgala como apuntes.',
  steps: [
    {
      title: 'Añade la grabación de la clase',
      text: 'Arrastra el archivo al cuadro de arriba o pulsa Elegir un archivo. Sirve un archivo de la grabadora de voz del teléfono, un video guardado de la clase o una grabación de pantalla de una clase en línea, y solo se usa el sonido. El cuadro acepta un archivo cada vez y lo lleva al cargador de la página siguiente, donde Añadir otro archivo incorpora las demás sesiones de un curso.',
    },
    {
      title: 'Define el idioma y la calidad',
      text: 'En la página siguiente, elige el idioma de la clase. Estándar sirve para una grabación clara. Para un aula con eco o quien habla rápido, Alta precisión ayuda si tu dispositivo puede ejecutarla (la opción aparece en gris, con el motivo, cuando no puede). Espera un trabajo más lento y una primera descarga más grande.',
    },
    {
      title: 'Añade los términos técnicos y empieza',
      text: 'En Más opciones, escribe en la pista de vocabulario los términos clave, los nombres y las abreviaturas, por ejemplo ciclo de Krebs, bayesiano, Dr. Okafor. Después pulsa Transcribir.',
    },
    {
      title: 'Lee, corrige y descarga',
      text: 'Reproduce líneas desde sus marcas de tiempo para comprobarlas y corrige los errores. Después descarga TXT o Markdown para tu aplicación de notas, o PDF para imprimir.',
    },
  ],

  formatsTitle: 'Archivos de grabaciones de clases y descargas',
  formatsIntro:
    'Se pueden añadir grabaciones del teléfono, videos guardados y grabaciones de pantalla de clases; solo se lee la pista de sonido.',
  uploadTitle: 'Archivos de grabación que puedes añadir',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'texto plano para una aplicación de notas' },
    { name: 'Markdown', use: 'texto con tiempos, fácil de reorganizar' },
    { name: 'PDF', use: 'una copia de estudio imprimible' },
    { name: 'SRT', use: 'subtítulos, si la clase es un video que compartes' },
  ],

  tipsTitle: 'Consejos para grabaciones de clases',
  tips: [
    {
      title: 'Pide permiso primero.',
      text: 'Algunos profesores e instituciones no permiten grabar. Pregunta y sigue las normas que te den.',
    },
    {
      title: 'Graba cerca de quien habla.',
      text: 'Una grabadora en la parte delantera del aula suele rendir mejor que una mejor en el fondo, porque la distancia y el eco suelen costar más precisión de la que puede recuperar cualquier ajuste.',
    },
    {
      title: 'Divide las sesiones muy largas.',
      text: 'Si una sesión es más grande o más larga que los límites de esta página, córtala en partes en el descanso antes de añadirla.',
      browser: {
        title: 'Las sesiones largas tardan más.',
        text: 'No hay ningún límite de duración, pero una clase larga mantiene ocupado tu dispositivo un buen rato y necesita memoria libre, y un navegador que no puede usar WebCodecs puede tener problemas con un archivo muy largo. Cortarlo en el descanso te da antes la primera mitad para leer.',
      },
    },
    {
      title: 'Ten las diapositivas abiertas mientras repasas.',
      text: 'Los títulos de las diapositivas te dan un esquema ya hecho para cotejarlo con las marcas de tiempo.',
    },
    {
      title: 'Descarga antes de irte.',
      text: 'Las transcripciones existen solo durante tu sesión. Guarda TXT o Markdown antes de cerrar la página.',
    },
  ],

  faqs: [
    {
      question: '¿Está permitido grabar una clase y transcribirla?',
      answer:
        'Depende de tu profesor y de tu institución, así que pregunta antes de grabar y sigue sus normas. Usa la transcripción para tu propio estudio, a menos que tengas permiso para compartirla. Esto no es asesoramiento jurídico.',
    },
    {
      question: '¿Puedo convertir automáticamente la transcripción de una clase en apuntes?',
      answer:
        'No. TranscribeVid te da las palabras, con una marca de tiempo en cada línea, pero no resume ni añade títulos. Tú construyes los apuntes a partir del texto, que además es una buena forma de aprender la materia.',
    },
    {
      question: '¿Funciona con clases que tienen ecuaciones o términos técnicos?',
      answer:
        'Escribe las palabras que oye, así que los términos dichos en voz alta suelen salir bien cuando los añades a la pista de vocabulario. Los símbolos y las ecuaciones no se escriben como fórmulas, así que compruébalos con tus diapositivas.',
    },
    {
      question: '¿Qué duración puede tener la clase que transcribo?',
      answer: '{limits} Una clase más larga hay que dividirla antes en partes.',
      browser: {
        answer:
          'No hay tope para la duración de la clase. Como tu propio dispositivo hace el trabajo, una clase larga cuesta sobre todo paciencia y memoria libre, y la página te avisa cuando tu dispositivo parece demasiado lento para ella.',
      },
    },
    {
      question: '¿Puedo transcribir una clase en línea que grabé en mi pantalla?',
      answer:
        'Sí. Funciona una grabación de pantalla guardada como MP4, MOV o WebM. Solo se lee el sonido, así que el texto de las diapositivas no se incluye. Añade los términos de las diapositivas a la pista de vocabulario.',
    },
  ],

  links: [
    {
      label: 'Video a texto',
      path: '/video-to-text',
      note: 'La página general para cualquier video grabado, con todos los tipos de archivo.',
    },
    {
      label: 'MP3 a texto',
      path: '/mp3-to-text',
      note: 'Para grabaciones de clases guardadas como MP3 en un teléfono o una grabadora.',
    },
    {
      label: 'Traducir voz a texto en inglés',
      path: '/translate-audio-to-english',
      note: 'Texto en inglés a partir de una clase en otro idioma.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Las decisiones de audio, idioma y calidad que reducen los errores en una grabación difícil.',
    },
  ],
};
