import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cómo conseguir una transcripción más precisa',
  lead: 'La precisión depende primero del sonido y luego de tres decisiones que controlas tú: el idioma, el nivel de calidad y una pista de vocabulario. Esta guía muestra qué cambiar antes de grabar, qué ajustes ayudan, cómo detectar los errores que quedan y qué no puede hacer en absoluto el reconocimiento de voz.',
  readingMinutes: 9,
  toolPath: '/video-to-text',
  toolCta: 'Transcribe un video con los mejores ajustes',
  blocks: [
    {
      title: 'Qué decide la precisión de una transcripción',
      paragraphs: [
        'El reconocimiento de voz escucha, más o menos como tú. Si una persona habla con claridad, cerca del micrófono, en una sala tranquila y en un idioma que el modelo conoce bien, la transcripción suele ser muy buena. Si el sonido es lejano, ruidoso, con eco o saturado de voces, hasta una persona tiene que concentrarse y el software comete más errores.',
        'Eso da un orden de prioridades sencillo. Arregla primero el audio, porque nada de lo que viene después puede recuperar palabras que nunca se captaron. Luego dile al programa el idioma. Después elige un nivel de calidad acorde con la dificultad. Luego dale las palabras poco comunes que no puede adivinar. Por último, revisa el resultado, porque ninguna transcripción es perfecta.',
      ],
    },
    {
      title: 'Mejora la propia grabación',
      paragraphs: ['Unos minutos de cuidado al grabar valen más que cualquier ajuste posterior.'],
      bullets: [
        {
          title: 'Acércate.',
          text: 'Pon el micrófono a una o dos palmas de la boca de quien habla. Un teléfono sostenido cerca rinde mejor que un portátil al otro lado de la mesa.',
        },
        {
          title: 'Elige una sala tranquila y mullida.',
          text: 'Las cortinas, las alfombras y los sofás absorben el eco. Las paredes desnudas y las salas grandes y vacías mezclan las palabras entre sí. Apaga ventiladores, aire acondicionado y notificaciones.',
        },
        {
          title: 'Mantén la música fuera de la voz.',
          text: 'La música de fondo es difícil de separar del habla. Añádela después de transcribir, no antes.',
        },
        {
          title: 'Una voz a la vez.',
          text: 'Los hablantes que se superponen son el caso más difícil. Pide a las personas que se esperen unas a otras y usa un micrófono por persona cuando puedas.',
        },
        {
          title: 'No te preocupes por la frecuencia de muestreo.',
          text: 'Los modelos de voz leen el sonido a 16 kHz en mono, y la página convierte cualquier archivo a eso automáticamente. Una frecuencia más alta o una mezcla envolvente no ayuda; lo que cuenta es la distancia, el ruido y el nivel.',
        },
        {
          title: 'Evita la compresión fuerte.',
          text: 'Los archivos de muy baja tasa de bits, como un mensaje de voz comprimido por una conexión débil, pierden detalle que el modelo necesita. Usa la grabación original cuando la tengas.',
        },
      ],
    },
    {
      title: 'Dile el idioma',
      paragraphs: [
        'La página puede detectar el idioma por sí sola y, en una grabación larga en inglés claro, normalmente acierta. Pero con clips cortos, acentos marcados y grabaciones que mezclan idiomas, la detección puede equivocarse, y un error vuelve mala toda la transcripción. Elegir el idioma en la lista Idioma lleva un clic y elimina el riesgo.',
        'Si la página no puede identificar el idioma con seguridad, lo dice y te pide que elijas el que oyes. Hazlo y vuelve a ejecutarla. Para un habla que cambia entre dos idiomas, como el español y el inglés, elige el idioma principal y revisa los pasajes en el otro.',
      ],
    },
    {
      title: 'Elige el nivel de calidad adecuado',
      paragraphs: [
        'Las cuatro opciones de calidad ejecutan tamaños distintos de la misma familia de modelos. Un modelo más grande comete menos errores con acentos, ruido, otros idiomas y palabras poco frecuentes, pero tarda más y tiene una primera descarga más grande.',
      ],
      table: {
        caption: 'Las opciones de calidad y cuándo usar cada una',
        head: ['Opción', 'Ideal para', 'Contrapartida'],
        rows: [
          [
            'Más rápido',
            'Habla clara en una grabación tranquila, borradores rápidos',
            'Es la que más errores comete de las cuatro con audio difícil',
          ],
          [
            'Estándar',
            'La mayoría de los videos y las grabaciones de voz (la opción de partida habitual)',
            'Un buen equilibrio entre velocidad y precisión',
          ],
          [
            'Alta precisión',
            'Acentos, ruido de fondo, habla que no es en inglés',
            'Más lenta, descarga más grande',
          ],
          [
            'Máxima precisión',
            'Audio difícil en el que cada palabra cuenta',
            'La más lenta, la descarga más grande',
          ],
        ],
      },
      after: [
        'Un buen hábito es empezar con Estándar sobre una muestra corta de tu grabación, leerla y subir un nivel solo si los errores te molestan. En Más opciones también puedes elegir de la lista completa de modelos. En algunos dispositivos Alta precisión y Máxima precisión aparecen atenuadas, con el motivo a la vista, por ejemplo que necesita 8 GB o que para ese tamaño conviene usar un ordenador, porque los modelos más grandes necesitan más memoria. Además, cada opción más grande es una primera descarga mayor, y la página muestra su tamaño antes de empezar.',
      ],
    },
    {
      title: 'Usa la pista de vocabulario para nombres y jerga',
      paragraphs: [
        'Los modelos de voz conocen bien las palabras comunes y mal las poco frecuentes. El nombre de una persona, una empresa, un producto, un lugar o un término técnico se escribe como el modelo lo considera más probable, que a menudo es incorrecto. La Pista de vocabulario de Más opciones existe para esto.',
        'Escribe las palabras poco comunes tal como quieres que aparezcan, por ejemplo una frase como «Entrevista con la Dra. Okafor sobre Kubernetes y PostgreSQL.» Una línea corta y natural que contenga las palabras funciona mejor que una lista larga. Es opcional y admite hasta 1000 caracteres. La página no la conserva entre tus ajustes recordados, por si contiene nombres privados.',
        'La pista ayuda con la ortografía. No enseña al modelo a oír una palabra que se masculla o que queda tapada por el ruido.',
      ],
    },
    {
      title: 'Mejorar el audio y Omitir silencios y música',
      paragraphs: [
        'Dos interruptores de Más opciones vienen activados de forma predeterminada y, para la mayoría de las grabaciones, conviene dejarlos así.',
      ],
      bullets: [
        {
          title: 'Mejorar el audio.',
          text: 'Filtra los retumbos muy graves y el siseo muy agudo, y luego iguala el volumen para que un hablante bajo no se pierda junto a uno fuerte. Si una grabación te suena bien pero la transcripción es rara, prueba una vez con este interruptor desactivado para ver si el filtro es la causa.',
        },
        {
          title: 'Omitir silencios y música.',
          text: 'Un detector de voz encuentra los tramos con voz humana y pasa solo esos al modelo. El silencio y la mayor parte del sonido que no es habla, como la música sin cantante, nunca le llegan, lo que evita gran parte del texto inventado que un modelo puede producir cuando no tiene nada que oír. La música con canto puede colarse igualmente. Desactívalo solo si se está descartando habla en voz baja.',
        },
      ],
      after: [
        'Las Marcas de tiempo por palabra también vienen activadas de forma predeterminada. No cambian qué palabras se encuentran, pero permiten que los subtítulos empiecen y terminen exactamente con las palabras y son la base de las marcas que muestran qué palabras eran dudosas.',
      ],
    },
    {
      title: 'Revisa el resultado: dónde se esconden los errores',
      paragraphs: [
        'Cuando la transcripción esté lista, no la leas primero de arriba abajo. Busca las marcas. Las palabras de las que el modelo estaba menos seguro aparecen subrayadas, con un subrayado más fuerte para las más inciertas. Si toda la transcripción tiene poca confianza, o el idioma era incierto, la página muestra un aviso con un botón para revisar el idioma y la calidad.',
        'La puntuación de confianza es una pista de dónde mirar, no un porcentaje de precisión, así que una palabra sin subrayado también puede estar mal. Dedica tu atención en este orden:',
      ],
      bullets: [
        {
          title: 'Nombres y lugares.',
          text: 'Son los errores más comunes y los más embarazosos.',
        },
        {
          title: 'Números, fechas y unidades.',
          text: 'Una cifra equivocada cambia el significado. Comprueba cada una con la grabación.',
        },
        {
          title: 'Palabras que suenan igual.',
          text: '«Haber» y «a ver», o «hecho» y «echo», se eligen según el contexto y pueden confundirse.',
        },
        {
          title: 'Pasajes cercanos al ruido o a voces superpuestas.',
          text: 'Vuelve a escuchar en la marca de tiempo. Haz clic en una línea para saltar a ese momento.',
        },
      ],
      after: [
        'Corrige lo que encuentres directamente en el texto. Tus ediciones se conservan en la transcripción y pasan a todas las exportaciones.',
      ],
    },
    {
      title: 'Problema y qué probar',
      table: {
        caption: 'Problemas frecuentes y qué probar primero',
        head: ['Problema', 'Qué probar'],
        rows: [
          [
            'Idioma equivocado, o texto en una escritura equivocada',
            'Elige tú mismo el idioma en lugar de Detectar automáticamente',
          ],
          [
            'Nombres y marcas mal escritos',
            'Añádelos a la Pista de vocabulario en Más opciones y luego vuelve a transcribir el archivo desde la página de inicio',
          ],
          [
            'Muchos errores con acentos o con sonido ruidoso',
            'Sube un nivel de calidad y mantén activado Mejorar el audio',
          ],
          [
            'Aparece texto donde nadie habla',
            'Mantén activado Omitir silencios y música; recorta las partes largas de silencio o con solo música',
          ],
          [
            'La misma frase se repite una y otra vez',
            'Mantén desactivado Usar el texto anterior como contexto y prueba con otro nivel de calidad',
          ],
          [
            'Dos personas hablando a la vez',
            'El software no puede arreglarlo: la próxima vez graba a cada una con un micrófono distinto',
          ],
          [
            'Se pierde a un hablante muy bajo o lejano',
            'Mantén activado Mejorar el audio; si aun así se pierde el habla, desactiva Omitir silencios y música para ese archivo',
          ],
        ],
      },
    },
    {
      title: 'Lo que el reconocimiento de voz no puede hacer',
      paragraphs: [
        'Conocer los límites te ayuda a detectar los problemas pronto. Una transcripción de cualquier reconocimiento de voz, incluido este, puede contener lo siguiente.',
      ],
      bullets: [
        {
          title: 'Sin nombres de hablantes.',
          text: 'Escribe lo que se dijo, no quién lo dijo. Añade los nombres a mano mientras editas.',
        },
        {
          title: 'Texto inventado.',
          text: 'Ante el silencio, la música o el ruido, un modelo puede producir palabras fluidas que nadie dijo, o repetir una frase muchas veces. Si ves texto donde no oyes nada, bórralo.',
        },
        {
          title: 'Homófonos y palabras raras equivocados.',
          text: 'Elige la palabra más probable, que no siempre es la correcta.',
        },
        {
          title: 'Palabras perdidas en las conversaciones cruzadas.',
          text: 'El habla superpuesta suele transcribirse como una sola voz o descartarse en parte.',
        },
        {
          title: 'Sin garantía.',
          text: 'Para cualquier asunto legal, médico, financiero o que se vaya a publicar, trata la transcripción como un borrador que una persona debe revisar.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: '¿Qué nivel de calidad da la transcripción más precisa?',
      answer:
        'Máxima precisión suele cometer menos errores, con Alta precisión a menudo muy cerca, y luego Estándar y Más rápido. La diferencia importa más con acentos, ruido e idiomas distintos del inglés. Con habla clara en inglés las diferencias son pequeñas, así que Estándar suele bastar.',
    },
    {
      question: '¿Un micrófono mejor ayuda más que un ajuste mejor?',
      answer:
        'Normalmente, sí. Un sonido limpio y cercano permite que un modelo más pequeño funcione bien, mientras que un sonido deficiente limita incluso al más grande. Acercar el micrófono y reducir el ruido de fondo es la mejora más barata que puedes hacer.',
    },
    {
      question: '¿Debo limpiar el audio en un editor antes de transcribir?',
      answer:
        'Rara vez. La página ya filtra los retumbos y el siseo e iguala el volumen cuando Mejorar el audio está activado. Los filtros fuertes de reducción de ruido de un editor pueden distorsionar el habla y empeorar el reconocimiento, así que usa ajustes suaves o ninguno.',
    },
    {
      question: '¿Por qué dos niveles de calidad dan textos distintos para el mismo archivo?',
      answer:
        'Son tamaños distintos de modelo, así que cada uno oye y escribe a su manera un pasaje difícil. Cuando dos ejecuciones no coinciden, escucha ese pasaje en su marca de tiempo, porque probablemente sea difícil y merezca comprobarse de oído.',
    },
    {
      question: '¿Puedo conseguir una transcripción más precisa editándola?',
      answer:
        'Editar corrige el texto que exportas; no vuelve a entrenar el modelo. Corrige nombres, números y palabras poco claras en la página de la transcripción y descarga la versión corregida. Una nueva ejecución con una pista de vocabulario reduce las correcciones la próxima vez.',
    },
  ],
  links: [
    {
      label: '¿Qué es Whisper?',
      path: '/guides/what-is-whisper',
      note: 'El modelo de voz que hay detrás de los niveles de calidad, y dónde es fuerte o débil.',
    },
    {
      label: 'Transcripción de entrevistas',
      path: '/interview-transcription',
      note: 'Consejos para transcribir una conversación con dos voces y muchos nombres.',
    },
    {
      label: 'Clase o conferencia a texto',
      path: '/lecture-to-text',
      note: 'Consigue apuntes de una clase grabada, incluso desde el fondo de una sala grande.',
    },
    {
      label: 'Audio en hindi a texto (página en inglés)',
      path: '/hindi-audio-to-text',
      note: 'Elegir el idioma es lo que más importa en hindi y en otras hablas que no son en inglés.',
    },
    {
      label: 'Transcribir un video sin subirlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Cómo funciona el motor en el navegador y qué cambia según el dispositivo que uses.',
    },
  ],
};
