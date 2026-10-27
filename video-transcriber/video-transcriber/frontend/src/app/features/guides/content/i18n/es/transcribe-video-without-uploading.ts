import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cómo transcribir un video sin subirlo',
  lead: 'En transcribevid.com el reconocimiento de voz se ejecuta dentro de tu propio navegador, así que tu archivo de video o de audio se lee en tu dispositivo y no se envía al sitio web, a Google ni a nadie más. Esta guía explica cómo funciona, qué sigue descargando tu navegador, qué sí se envía y cómo puedes comprobarlo todo tú mismo.',
  readingMinutes: 11,
  toolPath: '/video-to-text',
  toolCta: 'Transcribe un video en tu dispositivo',
  blocks: [
    {
      title: 'Qué significa «sin subir el archivo» aquí',
      paragraphs: [
        'La mayoría de los servicios de transcripción en línea funcionan igual: envías tu archivo a su servidor, un equipo que no ves lo transcribe y descargas el resultado. Tu grabación permanece en la máquina de otra persona durante todo el tiempo que decida conservarla.',
        'En transcribevid.com el trabajo ocurre al revés. El programa de reconocimiento de voz llega a tu navegador y tu navegador lo ejecuta en tu propio equipo o teléfono. La página que tienes abierta lee el archivo multimedia de tu disco. Nunca se adjunta a una solicitud al sitio, y nunca se envía a Google, a las empresas que alojan las descargas ni a ningún servicio de voz.',
        'Por eso el sitio no fija ningún límite de tamaño ni de duración y no tiene cola: no hay ningún servidor nuestro haciendo el trabajo, así que nada genera un costo por archivo y nadie espera por delante de ti. Una grabación muy larga sigue necesitando tiempo y memoria libre en tu dispositivo. También por eso una entrevista confidencial o un video familiar privado pueden transcribirse sin salir de tu dispositivo.',
        'Esta guía describe el sitio web de transcribevid.com. Una copia del software que alguien instala en su propio servidor funciona de otra manera: envía el archivo a ese servidor mediante una conexión cifrada y lo borra automáticamente después.',
      ],
    },
    {
      title: 'Cómo funciona, paso a paso',
      steps: [
        {
          title: 'La página se carga',
          text: 'Tu navegador obtiene la página y su código de programa de transcribevid.com, que está alojado en Cloudflare. Es lo mismo que abrir cualquier otro sitio web.',
        },
        {
          title: 'El modelo de voz se descarga una sola vez',
          text: 'La primera vez que usas un nivel de calidad, tu navegador descarga de Hugging Face el modelo de reconocimiento de voz correspondiente, junto con los archivos del motor que lo ejecuta, que vienen de jsDelivr. Se guardan en la caché de tu navegador, así que la siguiente transcripción empieza sin volver a descargarlos.',
        },
        {
          title: 'Tu archivo se decodifica en tu dispositivo',
          text: 'Los decodificadores de audio y de video integrados en el navegador convierten el archivo en sonido simple de 16 kHz y un solo canal (mono), que es lo que lee el modelo. Para unos pocos formatos que el navegador no puede abrir por sí mismo, como AVI, WMA y FLV, la página pregunta primero y después descarga un conversor de unos 9 MB, que también se ejecuta en tu dispositivo.',
        },
        {
          title: 'Un worker ejecuta el modelo',
          text: 'Un hilo en segundo plano de la página, llamado Web Worker, ejecuta el modelo para que la página siga respondiendo. Usa tu chip gráfico mediante WebGPU cuando el navegador lo admite y, si no, tu procesador mediante WebAssembly.',
        },
        {
          title: 'El texto aparece y se queda en tu navegador',
          text: 'La transcripción se construye línea a línea con marcas de tiempo. Se guarda en el almacenamiento propio de tu navegador durante la sesión, y los archivos SRT, VTT, TXT, Markdown, JSON y PDF que descargas también se crean en tu dispositivo.',
        },
      ],
    },
    {
      title: 'Qué descarga tu navegador',
      paragraphs: [
        'No subir no significa no descargar. Un modelo de voz es un archivo grande y tu navegador tiene que obtenerlo antes de poder transcribir nada. Esto es lo que llega, y de dónde.',
      ],
      table: {
        caption: 'Qué descarga la página, de dónde y cuándo',
        head: ['Qué', 'De dónde', 'Cuándo', 'Tamaño aproximado'],
        rows: [
          [
            'La página y su código de programa',
            'transcribevid.com (Cloudflare)',
            'En cada visita, y luego queda en la caché',
            'Unos 200 KB',
          ],
          [
            'El código del motor que ejecuta el modelo',
            'transcribevid.com',
            'En la primera transcripción, y luego queda en la caché',
            'Menos de 1 MB',
          ],
          [
            'El entorno de ejecución del modelo (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'En la primera transcripción, y luego queda en la caché',
            'Entre 17 y 27 MB aproximadamente',
          ],
          [
            'Un pequeño modelo de detección de voz',
            'transcribevid.com',
            'En la primera transcripción, y luego queda en la caché',
            'Unos 1,2 MB',
          ],
          [
            'El modelo de voz de tu nivel de calidad',
            'huggingface.co (Hugging Face)',
            'Una vez por nivel de calidad, y luego queda en la caché',
            'Desde unos 40 MB hasta unos pocos GB (ver más abajo)',
          ],
          [
            'Un conversor para formatos que el navegador no puede abrir (AVI, WMA, FLV y similares)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Solo si tu archivo lo necesita, y solo después de que aceptes',
            'Unos 9 MB',
          ],
          [
            'El modelo de ortografía del hindi (IndicXlit)',
            'transcribevid.com',
            'Solo cuando el hindi se escribe con letras latinas (hinglish), y luego queda en la caché',
            'Unos 13 MB',
          ],
        ],
      },
      after: [
        'Estas descargas son archivos de programa y de modelo, no tus datos. Las empresas que las entregan ven los datos habituales de cualquier solicitud web, como tu dirección de internet y tu navegador, pero nunca tu archivo multimedia ni tu transcripción.',
      ],
    },
    {
      title: 'Qué se sigue enviando, con total franqueza',
      paragraphs: ['Tres cosas sí llegan a un servidor, y ninguna es tu archivo ni tu texto.'],
      bullets: [
        {
          title: 'El alojamiento.',
          text: 'Cloudflare entrega el sitio web, así que procesa tu dirección de internet y los datos habituales de la solicitud para entregar y proteger el sitio.',
        },
        {
          title: 'Un total acumulado.',
          text: 'Cuando termina una transcripción, tu navegador envía una solicitud vacía al contador del sitio, que suma uno al número que aparece en el encabezado. No lleva ningún archivo, ninguna transcripción ni ningún identificador. El contador lo informan los navegadores de los visitantes y no está verificado de forma independiente.',
        },
        {
          title: 'Publicidad.',
          text: 'El sitio es gratuito porque muestra anuncios servidos por Google AdSense, en páginas informativas, nunca mientras se transcribe un archivo ni junto a tu transcripción. Google usa cookies para los anuncios y, donde la ley lo exige, pide antes tu consentimiento. Los scripts de anuncios de Google hacen solicitudes propias a Google, pero tu archivo y tu transcripción nunca se envían a Google.',
        },
      ],
      after: [
        'La política de privacidad lo explica todo en detalle. No hay cuenta, y el sitio no pide ningún nombre ni correo electrónico.',
      ],
    },
    {
      title: 'Cómo comprobarlo tú mismo',
      paragraphs: [
        'No tienes que fiarte de nuestra palabra. Todos los navegadores modernos pueden mostrarte lo que una página envía y recibe, y la comprobación lleva dos minutos.',
      ],
      steps: [
        {
          title: 'Abre las herramientas para desarrolladores',
          text: 'En Chrome, Edge o Firefox, abre la página de inicio de transcribevid.com y pulsa F12 (en un Mac, Comando, Opción e I). Elige la pestaña Network (Red).',
        },
        {
          title: 'Vacía la lista',
          text: 'Pulsa el botón de borrar, que parece un círculo con una línea, para que solo aparezcan las solicitudes nuevas.',
        },
        {
          title: 'Inicia una transcripción',
          text: 'Añade un archivo y pulsa Transcribir. Mantén visible la pestaña Network.',
        },
        {
          title: 'Observa lo que entra',
          text: 'La primera vez verás grandes descargas desde huggingface.co y cdn.jsdelivr.net. Son el modelo y el motor que llegan.',
        },
        {
          title: 'Busca lo que sale',
          text: 'Escribe method:POST en el cuadro de filtro (Chrome y Edge; Firefox acepta el mismo filtro). La única solicitud POST a transcribevid.com debería ser una solicitud vacía a /api/count cuando termina la transcripción. Ábrela y comprueba su cuerpo: está vacío. Si la página muestra anuncios, los propios scripts de Google hacen solicitudes propias a Google, y ninguna lleva tu archivo ni tu transcripción. Nada que se acerque al tamaño de tu archivo sale de tu dispositivo.',
        },
      ],
    },
    {
      title: '¿Qué tamaño tiene la primera descarga y a qué velocidad va?',
      paragraphs: [
        'El tamaño depende del nivel de calidad y del tipo de dispositivo. Un dispositivo con WebGPU recibe una versión compacta para su tamaño, mientras que uno que usa WebAssembly recibe una versión distinta. La página te indica el tamaño exacto de la descarga antes de empezar, así que nunca te llevas una sorpresa. Estos son los tamaños aproximados de los archivos del modelo (las cifras de WebGPU corresponden a navegadores con compatibilidad con shaders de 16 bits; otros dispositivos reciben otras versiones):',
      ],
      table: {
        caption: 'Descarga aproximada del modelo la primera vez',
        head: ['Nivel de calidad', 'Modelo Whisper', 'Con WebGPU', 'Con WebAssembly'],
        rows: [
          ['Más rápido', 'Base', 'Unos 146 MB', 'Unos 77 MB'],
          ['Estándar', 'Small', 'Unos 485 MB', 'Unos 249 MB'],
          ['Alta precisión', 'Large v3 Turbo', 'Unos 564 MB', 'Unos 1,1 GB'],
          [
            'Máxima precisión',
            'Large v3',
            'Unos 980 MB, más unos 564 MB para las marcas de tiempo por palabra',
            'Unos 1,8 GB, más unos 1,1 GB para las marcas de tiempo por palabra',
          ],
        ],
      },
      after: [
        'Añade unos pocos megabytes para los archivos de configuración del modelo. Large v3 no tiene una versión propia con tiempos por palabra, así que con las Marcas de tiempo por palabra activadas, que es lo predeterminado, su primera ejecución también descarga el modelo de tiempos Large v3 Turbo, y la página lo indica antes de empezar. Ese modelo Turbo se conserva y se comparte con la opción Alta precisión. Tras la primera descarga, el modelo se lee de la caché de tu navegador, así que las transcripciones posteriores empiezan al instante. La velocidad a partir de entonces depende por completo de tu dispositivo: un equipo con un chip gráfico potente y WebGPU es mucho más rápido que un teléfono o un portátil antiguo que use WebAssembly.',
      ],
    },
    {
      title: 'Cuándo es la herramienta adecuada y cuándo no',
      paragraphs: [
        'Transcribir en tu propio dispositivo es una buena opción para el material privado y para los archivos largos. No es la mejor herramienta para todo.',
      ],
      bullets: [
        {
          title: 'Bueno para grabaciones confidenciales.',
          text: 'En transcribevid.com, las entrevistas, las reuniones, las notas médicas o legales y los videos personales se quedan en tu dispositivo.',
        },
        {
          title: 'Bueno para archivos largos.',
          text: 'En transcribevid.com no hay que esperar ninguna subida y no se fija ningún límite de tamaño ni de duración. Una grabación muy larga necesita tiempo y memoria libre, y un navegador sin compatibilidad con WebCodecs puede rechazar un archivo muy largo.',
        },
        {
          title: 'No sirve para subtítulos en directo.',
          text: 'La transcripción se crea a partir de un archivo o una grabación terminados. No subtitula un evento en directo mientras ocurre.',
        },
        {
          title: 'No sirve para nombres de hablantes.',
          text: 'Las líneas llevan marcas de tiempo, pero el texto no dice quién habla. Puedes escribir los nombres mientras editas.',
        },
        {
          title: 'No es lo ideal en un teléfono poco potente.',
          text: 'Los teléfonos tienen menos memoria. La página te avisa, y puede desactivar los niveles de calidad más grandes, cuando tu dispositivo no puede ejecutarlos. Corta las grabaciones muy largas en partes.',
        },
        {
          title: 'No si no puedes descargar una vez un archivo grande.',
          text: 'El primer uso necesita una conexión capaz de obtener decenas o cientos de megabytes.',
        },
      ],
    },
    {
      title: 'Borrar tus datos después',
      paragraphs: [
        'En transcribevid.com, tus transcripciones y el archivo de origen se guardan en el almacenamiento de tu navegador para que la página pueda mostrarlos y permitirte editarlos y exportarlos. Se borran automáticamente cuando tu sesión termina tras un periodo de inactividad, o de inmediato cuando pulsas Borrar mis datos ahora en el menú Transcripciones. Los datos borrados no se pueden recuperar, así que exporta antes lo que necesites.',
        'Los modelos de voz permanecen en la caché de tu navegador para que las transcripciones posteriores sean rápidas, hasta que los borres (Borrar mis datos ahora también puede eliminarlos) o tu navegador limpie su almacenamiento. Si usas un equipo compartido o público, pulsa Borrar mis datos ahora antes de irte, porque cualquiera que pueda abrir ese perfil del navegador puede leer lo que hay guardado en él.',
      ],
    },
  ],
  faqs: [
    {
      question: '¿Es verdad que mi archivo nunca se sube?',
      answer:
        'Sí, en transcribevid.com. El reconocimiento se ejecuta en tu navegador y la página lee tu archivo de tu propio disco. Puedes confirmarlo en la pestaña Network de las herramientas para desarrolladores de tu navegador: la única solicitud que envía algo a transcribevid.com es una solicitud de recuento vacía después de que termina la transcripción, y los scripts de anuncios de Google hacen solicitudes propias a Google que nunca llevan tu archivo.',
    },
    {
      question: '¿La transcripción sigue funcionando si mi conexión es lenta?',
      answer:
        'La parte lenta es la primera descarga del modelo de voz, que puede ser de cientos de megabytes. Una vez guardado en tu navegador, la transcripción en sí usa tu propio dispositivo y no necesita velocidad de red.',
    },
    {
      question: '¿Por qué mi navegador descarga un modelo desde otro sitio web?',
      answer:
        'El modelo es el programa que reconoce el habla y es demasiado grande para incluirlo en la página. Se descarga de Hugging Face, un alojamiento público para este tipo de modelos, y el motor que lo ejecuta viene de jsDelivr. Ninguno de los dos recibe tu archivo multimedia ni tu transcripción.',
    },
    {
      question: '¿Transcribir en mi dispositivo es más rápido que subir el archivo?',
      answer:
        'Puede serlo, porque no hay subida ni cola, y un equipo con WebGPU es rápido. En un portátil antiguo o en un teléfono, el mismo trabajo puede tardar más que en un servidor rápido. La primera ejecución incluye además la descarga única del modelo.',
    },
  ],
  links: [
    {
      label: 'Transcripción de entrevistas',
      path: '/interview-transcription',
      note: 'La vía privada para entrevistas de investigación, de periodismo y de selección de personal.',
    },
    {
      label: '¿Qué es Whisper?',
      path: '/guides/what-is-whisper',
      note: 'El modelo de voz que ejecuta tu navegador, explicado con palabras sencillas.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Ajustes y hábitos que dan mejor texto, sea cual sea el dispositivo.',
    },
    {
      label: 'Video a texto',
      path: '/video-to-text',
      note: 'Añade un video y míralo convertirse en texto con marcas de tiempo en tu propio dispositivo.',
    },
    {
      label: 'Grabación de reunión a texto',
      path: '/meeting-recording-to-text',
      note: 'Convierte una grabación guardada de Zoom, Teams o Meet en una transcripción en la que se puede buscar.',
    },
  ],
};
