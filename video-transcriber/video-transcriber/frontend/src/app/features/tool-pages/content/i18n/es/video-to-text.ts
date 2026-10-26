import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Video a texto',
  h1: 'Convertir video a texto, gratis y con marcas de tiempo',
  lead: 'Sube un video grabado y mira cómo su voz se convierte en texto, línea por línea, cada una con su hora. Clases, entrevistas, reuniones, clips grabados con el teléfono y capturas de pantalla funcionan, en más de 50 idiomas.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Por qué pasar un video a texto',
  why: [
    'Un video es lento para buscar en él. No puedes ojearlo, citarlo ni copiar una frase. Una transcripción convierte la voz en texto que puedes buscar, citar, traducir y leer en una fracción del tiempo, y cada línea conserva su marca de tiempo para que vuelvas al momento exacto.',
    'La gente lo usa para clases y seminarios web grabados, entrevistas, reuniones de equipo guardadas, demostraciones de producto, vlogs y clips cortos de redes sociales. El texto también es un buen punto de partida para subtítulos, notas de un programa, artículos de blog y actas de reuniones.',
  ],

  howTitle: 'Cómo convertir un video a texto',
  howToDescription:
    'Sube un archivo de video, elige el idioma hablado, espera la transcripción y descárgala como texto o subtítulos.',
  steps: [
    {
      title: 'Elige tu video',
      text: 'Suelta el video en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. Se abre en el cargador, donde puedes añadir más videos.',
    },
    {
      title: 'Ajusta el idioma y la calidad',
      text: 'Elige el idioma hablado para obtener la mejor precisión, o deja activada la detección automática. Estándar sirve para la mayoría de los videos. Más rápido es veloz con voces claras. Para audio con ruido o difícil elige Alta precisión o Máxima precisión; Máxima precisión tarda más y comete menos errores.',
    },
    {
      title: 'Míralo transcribirse',
      text: 'El texto aparece en directo, línea por línea, con una barra de progreso y una estimación del tiempo restante.',
    },
    {
      title: 'Edita y descarga',
      text: 'Corrige cualquier línea en el editor y descarga TXT, SRT, VTT, Markdown, JSON o PDF. No se guarda nada cuando termina tu sesión, así que descarga antes de irte.',
    },
  ],

  formatsTitle: 'Archivos de video compatibles y descargas',
  formatsIntro:
    'TranscribeVid lee la pista de sonido, así que la imagen puede tener cualquier calidad. Los archivos solo de audio también funcionan.',
  uploadTitle: 'Archivos de video que puedes subir',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'texto sin formato para leer o pegar' },
    { name: 'SRT', use: 'subtítulos para reproductores y editores' },
    { name: 'VTT', use: 'subtítulos para video en la web' },
    { name: 'Markdown', use: 'texto con títulos y tiempos' },
    { name: 'JSON', use: 'líneas con tiempos para programas' },
    { name: 'PDF', use: 'una copia para imprimir' },
  ],

  tipsTitle: 'Consejos para mejores transcripciones de video',
  tips: [
    {
      title: 'Escucha primero el primer minuto.',
      text: 'Si te cuesta seguir la voz con los altavoces de la computadora portátil, al programa también le costará. Arregla los problemas de volumen antes de subirlo.',
    },
    {
      title: 'Indica el idioma.',
      text: 'Elegir el idioma hablado es más fiable que la detección automática, sobre todo en clips cortos o con acento.',
    },
    {
      title: 'Añade una pista de vocabulario.',
      text: 'En Más opciones escribe nombres, marcas y jerga tal como quieres verlos escritos.',
    },
    {
      title: 'Respeta el límite.',
      text: 'Los videos más largos o más grandes que el límite indicado arriba se rechazan, así que divide antes las grabaciones largas en partes.',
      browser: {
        title: 'Los videos largos tardan más.',
        text: 'No hay límite de tamaño, pero un video largo tarda más en tu dispositivo y necesita más memoria. En un teléfono, divide en partes las grabaciones muy largas.',
      },
    },
    {
      title: 'Revisa las líneas marcadas.',
      text: 'Las líneas de las que el reconocedor de voz no está seguro aparecen marcadas. Revísalas primero, porque ninguna transcripción es perfecta.',
    },
  ],

  faqs: [
    {
      question: '¿Es realmente gratis convertir video a texto?',
      answer:
        'Sí. Es gratis, no hace falta cuenta ni inicio de sesión y no hay cuota diaria ni mensual. {limits} Si mucha gente usa el servicio, tu archivo puede esperar un rato en una cola.',
      browser: {
        answer:
          'Sí. Es gratis, no hace falta cuenta ni inicio de sesión y no hay cuota diaria ni mensual; los anuncios lo mantienen gratuito. Tu video se transcribe en tu navegador, en tu propio dispositivo, así que no hay límite de tamaño y nadie va por delante de ti: la velocidad depende de tu dispositivo.',
      },
    },
    {
      question: '¿Puedo transcribir un video sin voz?',
      answer:
        'Solo la voz se convierte en texto. Un video mudo, o con solo música, da un resultado vacío o muy corto. El texto que aparece en pantalla no se lee.',
    },
    {
      question: '¿Puedo pegar un enlace de YouTube?',
      answer:
        'No. TranscribeVid trabaja con archivos que subes o grabas, no con enlaces web. Si el video es tuyo, sube el archivo original.',
    },
    {
      question: '¿Indica quién está hablando?',
      answer:
        'No. No se añaden nombres ni etiquetas de hablantes. Cada línea tiene una marca de tiempo y puedes escribir los nombres en el texto mientras editas.',
    },
    {
      question: '¿Qué precisión tiene la conversión de video a texto?',
      answer:
        'Con voz clara en un idioma compatible suele ser muy precisa, pero ningún reconocimiento de voz es perfecto. El ruido, los acentos, la música y las voces que se solapan reducen la precisión, así que comprueba con el video los pasajes importantes.',
    },
  ],
};
