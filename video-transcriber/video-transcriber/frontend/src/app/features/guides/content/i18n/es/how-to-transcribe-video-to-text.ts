import { GuideContent } from '../../../guide.model';

/** Los pasos de otras herramientas son tal como los describen sus propias páginas; aquí no se midió nada. La guía comparativa contiene los límites con sus fuentes. */
export const CONTENT: GuideContent = {
  h1: 'Cómo transcribir un video a texto: cinco maneras y cuál se ajusta a tu video',
  lead: 'Puedes obtener las palabras de un video como texto de cinco maneras: la transcripción que YouTube ya tiene, el dictado por voz, los subtítulos de un editor de video, un servicio en línea o una herramienta que se ejecuta en tu propio dispositivo. Se diferencian en el costo, en si obtienes la hora en cada línea y en lo que te piden antes. Esta guía explica qué hace cada una y cuándo elegirla.',
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Transcribir un video a texto, gratis y sin cuenta',
  blocks: [
    {
      title: 'La respuesta corta',
      bullets: [
        {
          title: 'El video está en YouTube y tiene subtítulos:',
          text: 'abre su transcripción en la página del video. No cuesta nada y lleva un minuto, pero solo existe cuando el video tiene subtítulos y el texto necesita una lectura atenta.',
        },
        {
          title: 'Tienes el archivo de video y quieres texto con tiempos:',
          text: 'usa una herramienta que acepte un archivo y te dé TXT y archivos de subtítulos. Las dos últimas maneras de abajo lo hacen.',
        },
        {
          title: 'Solo necesitas unas pocas citas:',
          text: 'reproduce el video y escribe, o usa el dictado por voz. Para algo más largo que unos minutos es más lento que dejar que un programa haga todo el archivo.',
        },
        {
          title: 'Quieres subtítulos para el mismo video:',
          text: 'elige una manera que exporte SRT o VTT, de modo que una sola ejecución te dé la transcripción y los subtítulos.',
        },
      ],
    },
    {
      title: 'Qué necesita tu video para una buena transcripción',
      paragraphs: [
        'Todas las maneras de abajo trabajan a partir de la pista de sonido, así que la calidad del sonido decide la calidad del texto mucho más que la imagen. Una voz cercana al micrófono, una persona a la vez y sin música de fondo sale bien. Una sala con eco, personas que hablan a la vez o un fondo ruidoso salen con errores en cualquier método.',
        'Antes de empezar, averigua tres cosas: el idioma en que se habla en el video, si necesitas la hora en cada línea y cuánto dura el video. La segunda te dice qué formatos debes poder descargar; la tercera, qué límites gratuitos te frenarán.',
      ],
    },
    {
      title: 'Manera 1: usar la transcripción que YouTube ya tiene',
      paragraphs: [
        'Muchos videos de YouTube llevan subtítulos, escritos por su autor o generados automáticamente. En la página de un video, abre la descripción: donde hay subtítulos aparece allí una opción para mostrar la transcripción, que enumera el texto con sus tiempos y que puedes copiar. Si el video es tuyo, YouTube Studio tiene una sección de Subtítulos donde puedes revisar y descargar los subtítulos. YouTube cambia estas pantallas de vez en cuando, así que los nombres pueden variar un poco.',
      ],
      after: [
        'Es la manera más rápida para un video que ya está en YouTube. Sus límites son que solo funciona con el enlace de un video que tenga subtítulos, que el texto automático puede ser flojo con nombres y palabras técnicas, y que no sirve para un archivo que está en tu computadora o teléfono.',
      ],
    },
    {
      title: 'Manera 2: reproducir el video y dejar que el dictado por voz escuche',
      paragraphs: [
        'El dictado por voz de un procesador de textos, como la opción de escritura por voz del menú Herramientas de Google Docs, escribe lo que oye su micrófono. Reproduces el video por los altavoces y él escribe.',
        'No cuesta nada, pero oye toda la habitación, no solo el video. No te da tiempos, funciona en tiempo real, así que un video de una hora lleva una hora, y lo que el micrófono no capta se pierde. Sirve para una cita o dos y es una mala opción para una clase o una entrevista.',
      ],
    },
    {
      title: 'Manera 3: activar los subtítulos automáticos en un editor de video',
      paragraphs: [
        'Algunos editores de video pueden transcribir la voz de un clip que colocas en ellos. La propia guía de Microsoft Clipchamp, por ejemplo, indica abrir la pestaña de subtítulos, activar los subtítulos automáticos y después descargarlos como archivo SRT; para que esto funcione, el audio del video debe contener voz.',
        'Es útil cuando de todos modos estás editando el video, porque los subtítulos quedan en la línea de tiempo. Para una transcripción simple es más trabajo del necesario: tienes que cargar el video en el editor y el texto sale como un archivo de subtítulos que después debes convertir en un documento.',
      ],
    },
    {
      title: 'Manera 4: usar un servicio de transcripción en línea',
      paragraphs: [
        'Decenas de sitios transcriben el archivo que les das. La mayoría son gratuitos solo hasta cierto punto: unos pocos minutos, unos pocos archivos o una vista previa que te pide pagar antes de poder descargar. Las diferencias que importan son si necesitas una cuenta, cuántos minutos te dan, qué tamaño puede tener un archivo y si el resultado se puede exportar.',
        'Los servicios son la elección adecuada cuando necesitas lo que las herramientas sencillas no hacen: nombres para cada hablante, un bot que se une a una reunión o un enlace a un video que no tienes como archivo. Abajo está enlazada nuestra guía con los límites gratuitos de trece de ellos, cada uno citado de su propia página.',
      ],
    },
    {
      title: 'Manera 5: transcribir el archivo con TranscribeVid',
      paragraphs: [
        'TranscribeVid acepta el archivo de video mismo, sin cuenta y sin cuota diaria. Ejecuta Whisper, un modelo de voz abierto, y devuelve el texto con la hora en cada línea.',
        'No acepta enlaces, no etiqueta quién habla y no se une a reuniones. Para esos trabajos, usa un servicio de la Manera 4.',
      ],
      browser: {
        paragraphs: [
          'TranscribeVid acepta el archivo de video mismo, sin cuenta, sin cuota diaria y sin límite de tamaño. Ejecuta Whisper, un modelo de voz abierto, en tu navegador, así que el video se queda en tu dispositivo, y el texto vuelve con la hora en cada línea.',
          'No acepta enlaces, no etiqueta quién habla y no se une a reuniones. Para esos trabajos, usa un servicio de la Manera 4. Como el trabajo lo hace tu propio dispositivo, un video largo va más lento en un teléfono antiguo que en una computadora portátil reciente.',
        ],
      },
      steps: [
        { title: 'Añade el video', text: 'Suelta el archivo en el cuadro de la página de la herramienta o pulsa Elegir un archivo. Funcionan MP4, MOV, MKV, WEBM y la mayoría de los demás archivos de video, y también los de audio.' },
        { title: 'Elige el idioma y la calidad', text: 'Indica el idioma hablado si lo conoces. Estándar sirve para la mayoría de los videos; elige Alta precisión o Máxima precisión para acentos, ruido o hindi.' },
        { title: 'Espera el texto', text: 'Las líneas aparecen una a una, con una barra de progreso y el tiempo restante.' },
        { title: 'Edita y descarga', text: 'Corrige cualquier línea en el editor y descarga TXT, SRT, VTT, PDF, Markdown o JSON. Descarga lo que quieras conservar antes de irte.' },
      ],
    },
    {
      title: 'Qué manera para qué video',
      table: {
        caption: 'Las cinco maneras lado a lado, tal como se describen en esta guía',
        head: ['Manera', 'Costo', 'Hora en cada línea', 'Funciona con', 'Ideal para'],
        rows: [
          ['Transcripción de YouTube', 'Gratis', 'Sí', 'Un video de YouTube con subtítulos', 'Una copia rápida de un video que ya está en línea'],
          ['Dictado por voz', 'Gratis', 'No', 'Todo lo que puedas reproducir en voz alta', 'Unas pocas citas'],
          ['Subtítulos del editor', 'Depende del editor', 'Sí, como subtítulos', 'Un clip cargado en el editor', 'Un video que de todos modos estás editando'],
          ['Servicio en línea', 'Gratis hasta un límite, después de pago', 'Normalmente', 'Archivos y, a veces, enlaces', 'Nombres de hablantes, reuniones, enlaces'],
          ['TranscribeVid', 'Gratis', 'Sí', 'Un archivo de video o de audio', 'Un archivo, con TXT y archivos de subtítulos de vuelta'],
        ],
      },
    },
    {
      title: 'Corrige el texto antes de usarlo',
      paragraphs: [
        'Elijas la manera que elijas, lee el resultado una vez con el video en reproducción. El reconocimiento de voz acierta con las palabras comunes y tropieza con lo que más te importa: nombres, términos de producto, números y todo lo que se dice deprisa.',
      ],
      bullets: [
        { title: 'Nombres y términos.', text: 'Busca en el texto cada nombre que sepas que aparece en el video y corrige todos los lugares donde sale.' },
        { title: 'Números y fechas.', text: 'Comprueba cada uno con el video; un dígito equivocado es fácil de pasar por alto.' },
        { title: 'Donde cambia el hablante.', text: 'Añade un salto de línea y un nombre, porque las transcripciones simples no marcan quién habla.' },
        { title: 'Subtítulos.', text: 'Si vas a usar un archivo SRT o VTT, mantén cada línea lo bastante corta para leerla en el tiempo que está en pantalla.' },
      ],
      after: [
        'Para una lista más larga de hábitos que reducen los errores antes de empezar, consulta la guía sobre cómo conseguir una transcripción más precisa.',
      ],
    },
  ],
  faqs: [
    {
      question: '¿Puedo transcribir un video a texto sin instalar nada?',
      answer: 'Sí. La transcripción de YouTube, un servicio en línea y TranscribeVid funcionan en un navegador web. Solo un editor de video o un programa de escritorio necesita instalación.',
    },
    {
      question: '¿Cuál es la manera más rápida de transcribir un video de una hora?',
      answer: 'Si está en YouTube con subtítulos, la transcripción de allí es inmediata. Para un archivo, un programa es mucho más rápido que escribir o que el dictado por voz, que tardan por lo menos lo que dura el video. Lo que tarda un programa depende de la herramienta, del nivel de calidad y, cuando se ejecuta en tu dispositivo, de lo rápido que sea ese dispositivo.',
    },
    {
      question: '¿Tengo que extraer primero el audio del video?',
      answer: 'No. Las herramientas que aceptan archivos de video leen ellas mismas la pista de sonido, así que puedes añadir un MP4 o MOV tal cual. Extraer antes el audio solo ayuda cuando una herramienta rechaza el formato del video.',
    },
    {
      question: '¿Cómo obtengo el texto con la hora en cada línea?',
      answer: 'Usa una manera que exporte subtítulos o una transcripción con tiempos: la transcripción de YouTube enumera los tiempos, y una herramienta que descarga SRT o VTT da a cada línea una hora de inicio y de fin. El dictado por voz no da ninguna.',
    },
  ],
  links: [
    {
      label: 'Herramientas gratuitas de video a texto comparadas',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Los límites gratuitos de trece herramientas en línea, cada uno citado de su propia página.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Hábitos y ajustes que reducen los errores en cualquier video.',
    },
    {
      label: 'Crea subtítulos para tu video',
      path: '/srt-subtitle-generator',
      note: 'Convierte el mismo video en un archivo SRT para reproductores y editores.',
    },
    {
      label: 'Transcribir un video sin subirlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Cómo el trabajo se queda en tu dispositivo y cómo comprobarlo tú mismo.',
    },
  ],
};
