import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: '¿Qué es Whisper? El reconocimiento de voz, explicado',
  lead: 'Whisper es un modelo de reconocimiento de voz de código abierto que OpenAI publicó en 2022. Convierte audio hablado en texto en unos cien idiomas y puede ejecutarse en tu propio ordenador. Esta guía explica de dónde viene, de qué aprendió, cómo funciona, dónde es fuerte y dónde débil, y cómo lo ejecuta TranscribeVid dentro de tu navegador.',
  readingMinutes: 8,
  toolPath: '/audio-to-text',
  toolCta: 'Prueba Whisper con tu propio audio',
  blocks: [
    {
      title: 'Whisper en un párrafo',
      paragraphs: [
        'Whisper es una red neuronal entrenada para escuchar el habla y escribir lo que oye. Le das sonido y devuelve texto con marcas de tiempo; además, puede indicar el idioma y traducir el habla al inglés. Existe en varios tamaños, desde una versión diminuta que cabe en un teléfono hasta una grande que necesita un ordenador potente.',
        'No es un sitio web ni un servicio. Es un conjunto de archivos: el modelo y el código para ejecutarlo. Cualquiera puede descargarlos y usarlos, y por eso muchas herramientas de transcripción gratuitas y privadas, incluida esta, se construyen sobre él.',
      ],
    },
    {
      title: 'De dónde viene',
      paragraphs: [
        'OpenAI publicó Whisper en septiembre de 2022, junto con un artículo de investigación titulado «Robust Speech Recognition via Large-Scale Weak Supervision». El código y los modelos entrenados se publicaron con la licencia MIT, una de las licencias de código abierto más permisivas. Permite usar, modificar y distribuir el software, también en productos comerciales.',
        'Antes de Whisper, el mejor reconocimiento de voz estaba sobre todo encerrado en los servicios de grandes empresas, o se había construido para un solo idioma o un solo tipo de audio. Whisper cambió eso al ser lo bastante bueno, lo bastante amplio y gratuito para ejecutarlo uno mismo. OpenAI también vende acceso a reconocimiento de voz a través de su propio servicio web, pero es un producto de pago aparte. El modelo que ejecutas aquí en tu navegador es el abierto.',
      ],
    },
    {
      title: 'Con qué se entrenó',
      paragraphs: [
        'Whisper aprendió de unas 680 000 horas de audio emparejado con transcripciones, recopiladas de internet. Aproximadamente un tercio de ese audio no estaba en inglés y abarcaba unos cien idiomas (la publicación enumera 99). No todas las transcripciones se revisaron a mano, y a eso se refiere la «supervisión débil» del título del artículo.',
        'De ahí se derivan dos resultados prácticos. Como el audio de entrenamiento era tan variado, con distintos micrófonos, acentos, salas y temas, Whisper se las arregla con grabaciones reales mejor que los modelos entrenados con habla limpia de estudio. Pero la cantidad de audio de entrenamiento difiere de un idioma a otro, así que la precisión es desigual: en general es mayor en inglés y en otros idiomas muy hablados que tuvieron muchos ejemplos, y menor en los idiomas con pocos datos de entrenamiento.',
      ],
    },
    {
      title: 'Cómo funciona, en palabras sencillas',
      paragraphs: [
        'Whisper corta el audio en ventanas de 30 segundos y convierte cada una en una imagen del sonido, llamada espectrograma, que muestra cuán fuerte es cada tono a lo largo del tiempo. El modelo tiene entonces dos mitades. Un codificador estudia esa imagen. Un decodificador escribe el texto una pequeña pieza cada vez, como lo haría una persona al escribir una frase mientras piensa en lo que viene después.',
        'El decodificador también escribe marcadores especiales: qué idioma cree que se habla, si debe transcribir o traducir, y dónde empieza y termina cada frase en el tiempo. De ahí salen las marcas de tiempo.',
        'Las grabaciones largas se procesan ventana por ventana. Este diseño es flexible, pero explica dos hábitos de Whisper: puede perder el hilo entre ventanas y puede repetirse cuando una ventana contiene poco habla. TranscribeVid reduce ambos con un detector de voz que omite el silencio y la mayor parte del sonido que no es habla antes de que el modelo lo vea, y con comprobaciones que detectan después parte del texto repetido o inventado.',
      ],
    },
    {
      title: 'Los tamaños del modelo y cuál obtienes aquí',
      paragraphs: [
        'Whisper existe en varios tamaños. Los modelos más grandes cometen menos errores, sobre todo con ruido y en idiomas distintos del inglés, pero son más lentos y necesitan más memoria y una descarga mayor. Las cuatro opciones de calidad de la página de subida se corresponden con estos tamaños así:',
      ],
      table: {
        caption: 'Los tamaños de Whisper y las opciones de TranscribeVid',
        head: ['Modelo', 'Parámetros (aproximados)', 'Dónde lo encuentras aquí'],
        rows: [
          ['Tiny', '39 millones', 'Más opciones, lista de modelos'],
          ['Base', '74 millones', 'Más rápido'],
          ['Small', '244 millones', 'Estándar'],
          ['Medium', '769 millones', 'Más opciones, lista de modelos'],
          ['Large v3 Turbo', '809 millones', 'Alta precisión'],
          ['Large v3', '1550 millones', 'Máxima precisión'],
        ],
      },
      after: [
        'Large v3 se publicó en noviembre de 2023 y la versión Turbo llegó después, en 2024. Turbo es un modelo grande recortado, mucho más rápido y cercano a él en precisión en muchos idiomas, y por eso es la opción Alta precisión. Una limitación: OpenAI dice que Turbo no se entrenó para traducir y puede devolver el idioma original cuando se le pide traducir, así que para Salida, Traducir al inglés elige Máxima precisión. La lista de modelos también incluye Distil Large v3, una versión destilada, más pequeña y rápida, de Whisper large v3, solo para inglés. En Motor de reconocimiento hay además Qwen3 ASR, un motor distinto y experimental para navegadores de escritorio con WebGPU. Qwen3 ASR no es un modelo Whisper.',
      ],
    },
    {
      title: 'Lo que hace bien',
      bullets: [
        {
          title: 'Audio del mundo real.',
          text: 'Grabaciones de teléfono, clases, entrevistas y bandas sonoras de videos con un ruido moderado.',
        },
        {
          title: 'Muchos idiomas en un solo modelo.',
          text: 'La misma familia de modelos maneja inglés, español, hindi, árabe, japonés y decenas más, y a menudo puede deducir el idioma por sí misma.',
        },
        {
          title: 'Puntuación y mayúsculas.',
          text: 'Escribe frases con mayúsculas y puntuación, en lugar de una larga cadena de palabras en minúsculas.',
        },
        {
          title: 'Marcas de tiempo.',
          text: 'Cada línea viene con una hora de inicio y de fin, y con las marcas de tiempo por palabra la página puede situar cada palabra.',
        },
        {
          title: 'Traducción al inglés.',
          text: 'Puede convertir el habla en otro idioma directamente en texto en inglés, algo que la página ofrece como Salida, Traducir al inglés. Turbo es la excepción: no se entrenó para traducir, así que usa Máxima precisión para esto.',
        },
      ],
    },
    {
      title: 'Dónde flaquea',
      paragraphs: [
        'Whisper es impresionante, y también es falible. Conoce estos hábitos antes de fiarte de una transcripción.',
      ],
      bullets: [
        {
          title: 'Puede inventar texto.',
          text: 'Ante el silencio, la música o el ruido, puede escribir palabras fluidas que nadie dijo, o repetir una frase una y otra vez. Es un comportamiento conocido del modelo, no un fallo de una grabación concreta.',
        },
        {
          title: 'Nombres, números y palabras raras.',
          text: 'Escribe un nombre como le parece más probable y puede confundir palabras de sonido parecido. Usa la pista de vocabulario y luego comprueba las cifras.',
        },
        {
          title: 'Idiomas desiguales.',
          text: 'La precisión varía según el idioma y el acento. Un modelo más grande ayuda mucho en los idiomas con menos datos de entrenamiento.',
        },
        {
          title: 'Sin etiquetas de hablante.',
          text: 'No dice quién habla, y las voces superpuestas a menudo se fusionan o se descartan.',
        },
        {
          title: 'No es en directo.',
          text: 'Trabaja sobre una grabación ventana por ventana, así que no está pensado para subtítulos que aparecen mientras alguien habla.',
        },
      ],
    },
    {
      title: 'Cómo ejecuta TranscribeVid Whisper en tu navegador',
      paragraphs: [
        'El Whisper original está escrito para software especializado de aprendizaje automático. Para ejecutarlo en una página web, los modelos se convierten a un formato portátil llamado ONNX, y una biblioteca llamada Transformers.js, de Hugging Face, los ejecuta con ONNX Runtime. En un ordenador con WebGPU el trabajo lo hace el chip gráfico, lo que es rápido. Si no, se ejecuta en el procesador mediante WebAssembly, que es más lento pero funciona casi en todas partes.',
        'Para mantener las descargas en un tamaño razonable, los modelos usan formatos numéricos compactos, que reducen los archivos, normalmente con un pequeño costo en precisión. Así es como el modelo más grande ocupa alrededor de un gigabyte con WebGPU (1,8 GB con WebAssembly) en lugar de varios.',
        'En transcribevid.com, ejecutar en el navegador tiene dos consecuencias. Primero, la privacidad: tu archivo multimedia se lee en tu dispositivo y no se sube, así que ningún servidor nuestro recibe jamás tu audio. Segundo, la velocidad: depende de tu dispositivo, y el primer uso de cada nivel de calidad incluye una descarga única del modelo. La guía sobre transcribir sin subir el archivo explica qué se descarga y cómo comprobarlo.',
      ],
    },
  ],
  faqs: [
    {
      question: '¿Whisper es gratuito?',
      answer:
        'El modelo y su código son gratuitos y de código abierto con la licencia MIT, así que cualquiera puede ejecutarlos. Ejecutar un modelo grande necesita un ordenador potente o un servidor alquilado, y OpenAI también ofrece su propio servicio web de pago. En transcribevid.com se ejecuta en tu dispositivo, así que no hay nada que pagar.',
    },
    {
      question: '¿Cuántos idiomas entiende Whisper?',
      answer:
        'Unos cien; la publicación enumera 99. La calidad difiere mucho entre ellos. TranscribeVid ofrece 61 en su lista Idioma, y además puedes elegir Detectar automáticamente.',
    },
    {
      question: '¿Qué tamaño de Whisper debería elegir?',
      answer:
        'Empieza con Estándar, que es el modelo Small. Pasa a Alta precisión si hay acentos, ruido o idiomas distintos del inglés, y a Máxima precisión cuando cada palabra cuente y puedas esperar. Más rápido es solo para habla clara y tranquila.',
    },
    {
      question: '¿Por qué Whisper a veces escribe palabras donde nadie habla?',
      answer:
        'El modelo está construido para producir siempre texto verosímil, así que un tramo de silencio, música o ruido puede llevarlo a inventar alguno. Mantener activado Omitir silencios y música omite la mayoría de esos tramos antes de que el modelo los vea.',
    },
  ],
  links: [
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Los ajustes y hábitos que más influyen en el resultado de Whisper.',
    },
    {
      label: 'Transcribir un video sin subirlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Qué descarga tu navegador para ejecutar Whisper y cómo verificar que no se sube nada.',
    },
    {
      label: 'Traducir habla al inglés',
      path: '/translate-audio-to-english',
      note: 'Usa la traducción de Whisper para obtener texto en inglés a partir de habla en otro idioma.',
    },
    {
      label: 'Audio a texto',
      path: '/audio-to-text',
      note: 'Sube una grabación y obtén una transcripción con marcas de tiempo.',
    },
    {
      label: 'Audio en hindi a texto (página en inglés)',
      path: '/hindi-audio-to-text',
      note: 'Cómo maneja Whisper el hindi, incluida una opción de hinglish con letras latinas.',
    },
  ],
};
