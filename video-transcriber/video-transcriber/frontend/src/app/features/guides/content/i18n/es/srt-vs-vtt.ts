import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT o VTT: ¿qué formato de subtítulos te conviene usar?',
  lead: 'SRT es la opción segura: casi todos los reproductores de video, editores y plataformas lo leen. Elige VTT (WebVTT) cuando los subtítulos sean para el elemento de video de una página web o cuando necesites estilo y posición. Los dos son archivos de texto sin formato y aquí puedes descargar cualquiera de ellos a partir de tu video.',
  readingMinutes: 8,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Crea un archivo SRT a partir de tu video',
  blocks: [
    {
      title: 'La respuesta corta',
      paragraphs: [
        'Si no estás seguro, usa SRT. Es el formato más antiguo y sencillo, y casi cualquier reproductor, editor de video o formulario de subida que encuentres lo acepta. Un archivo de subtítulos que funciona en todas partes vale más que uno ingenioso.',
        'Usa VTT cuando el video se reproduzca en una página web mediante el elemento video de HTML. Los navegadores solo cargan pistas de subtítulos en formato WebVTT, así que un archivo SRT no funcionará ahí sin conversión. VTT también es la mejor opción cuando quieres colocar el texto en la pantalla, añadir negrita o cursiva con confianza o indicar quién habla.',
        'El resto de esta guía explica por qué, te muestra cómo es cada archivo por dentro y te cuenta cómo pasar de uno a otro sin romper nada.',
      ],
    },
    {
      title: 'Cómo es un archivo SRT',
      paragraphs: [
        'SRT significa SubRip Text, por un programa de Windows de principios de los años 2000 que copiaba los subtítulos de los DVD. El formato nunca se estandarizó de manera oficial, pero se volvió tan común que todo lo admite. Un archivo SRT es una lista de bloques numerados, cada uno separado del siguiente por una línea vacía.',
      ],
      code: {
        label: 'Un archivo SRT pequeño',
        text: `1
00:00:01,000 --> 00:00:03,500
Welcome to the show.

2
00:00:03,800 --> 00:00:07,200
Today we look at how
subtitle files are built.

3
00:00:07,600 --> 00:00:10,000
Let's start with the basics.`,
      },
      after: [
        'Cada bloque tiene tres partes: un número correlativo, una línea con la hora de inicio y la hora de fin, y una o dos líneas de texto. Las horas se escriben como horas, minutos, segundos y milisegundos, y los milisegundos se separan con una coma. Esa coma es la causa más habitual de que falle un archivo convertido a mano.',
        'Guarda el archivo como texto sin formato en UTF-8 con la extensión .srt. UTF-8 importa en cuanto el texto tiene tildes, devanagari, árabe o cualquier otro carácter que no sea del inglés.',
      ],
    },
    {
      title: 'Cómo es un archivo WebVTT',
      paragraphs: [
        'WebVTT, que suele abreviarse como VTT, se diseñó para la web y está definido en una especificación publicada por el W3C, el organismo que estandariza las tecnologías web. Se parece a SRT, pero añade una línea de encabezado obligatoria y algunos extras opcionales.',
      ],
      code: {
        label: 'Los mismos subtítulos como archivo WebVTT',
        text: `WEBVTT

NOTE This file was made from the SRT example.

intro
00:00:01.000 --> 00:00:03.500
Welcome to the show.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Today we look at how
subtitle files are built.

00:00:07.600 --> 00:00:10.000
<v Maria>Let's start with the basics.</v>`,
      },
      after: [
        'Cuatro detalles lo distinguen. La primera línea debe ser WEBVTT. Los milisegundos se separan con un punto, no con una coma. Un bloque puede tener un nombre (la palabra intro de arriba) en lugar de un número, o además de él, y los números son opcionales. Y después de las horas puedes añadir ajustes como line, position y align, que mueven el texto en la pantalla.',
        'También puedes escribir bloques NOTE para comentarios que los espectadores nunca ven, indicar quién habla con la etiqueta v y usar etiquetas simples como b, i y u para negrita, cursiva y subrayado. Guarda el archivo en UTF-8 con la extensión .vtt.',
      ],
    },
    {
      title: 'SRT y VTT, frente a frente',
      paragraphs: [
        'Esta tabla pone los dos formatos lado a lado. Las diferencias que importan en el uso diario son el encabezado, el separador decimal y los lugares donde se acepta cada formato.',
      ],
      table: {
        caption: 'SRT comparado con WebVTT',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['Extensión del archivo', '.srt', '.vtt'],
          ['Primera línea', 'El número 1', 'La palabra WEBVTT'],
          ['Formato de la hora', '00:00:01,000 (coma)', '00:00:01.000 (punto)'],
          ['Números de bloque', 'Obligatorios', 'Opcionales (se permite un nombre)'],
          [
            'Posición en pantalla',
            'No está en el formato',
            'Ajustes del bloque: line, position, align, size',
          ],
          [
            'Estilo y etiquetas de hablante',
            'Solo etiquetas básicas; el soporte varía según el reproductor',
            'Definidos en la especificación, además de estilo con CSS',
          ],
          ['Comentarios', 'Ninguno', 'Bloques NOTE'],
          ['Elemento de video de una página web', 'No se acepta', 'Es el formato obligatorio'],
          ['Especificación formal', 'Ninguna (un formato de hecho)', 'Especificación del W3C'],
        ],
      },
      after: [
        'En pocas palabras: SRT es el archivo más simple y de mayor alcance, y VTT es el archivo más completo con un hogar más estrecho pero más moderno. Para subtítulos corrientes de lengua hablada, el texto en pantalla se ve igual con cualquiera de los dos.',
      ],
    },
    {
      title: 'Dónde se acepta cada formato',
      paragraphs: [
        'El soporte cambia con el tiempo y cada plataforma redacta a su manera sus páginas de ayuda, así que tómalo como una orientación y consulta la página de ayuda actual del servicio al que subes el archivo.',
      ],
      bullets: [
        {
          title: 'Páginas web.',
          text: 'El elemento track de la etiqueta video de HTML necesita WebVTT. Es el único lugar donde SRT no es una opción.',
        },
        {
          title: 'YouTube.',
          text: 'La subida de subtítulos acepta SRT y también VTT, entre otros formatos. SRT es la opción habitual.',
        },
        {
          title: 'Reproductores de escritorio y móviles.',
          text: 'VLC y la mayoría de los demás reproductores leen SRT, y muchos también leen VTT. Un reproductor suele cargar un archivo de subtítulos que tenga el mismo nombre que el video.',
        },
        {
          title: 'Editores de video.',
          text: 'La mayoría de los editores importan SRT como pista de títulos o de subtítulos. Algunos importan también VTT. Si rechazan un formato, prueba con el otro.',
        },
        {
          title: 'Otras plataformas sociales y de aprendizaje.',
          text: 'Muchas piden SRT o VTT y algunas piden solo uno de los dos. Lee la página de subida antes de exportar.',
        },
      ],
    },
    {
      title: 'Convertir de SRT a VTT y al revés, a mano',
      paragraphs: [
        'Cambiar el nombre del archivo no basta. Un archivo llamado talk.vtt que aún contiene SRT lo rechazan los navegadores, porque le falta el encabezado y sus horas usan comas. La conversión lleva un minuto en cualquier editor de texto.',
      ],
      steps: [
        {
          title: 'De SRT a VTT, primer paso',
          text: 'Añade la línea WEBVTT al principio de todo, seguida de una línea vacía.',
        },
        {
          title: 'De SRT a VTT, segundo paso',
          text: 'En cada línea de hora, cambia la coma que va antes de los milisegundos por un punto. Una búsqueda y reemplazo sobre las líneas con -->, o sobre el patrón de dígitos que rodea la coma, ahorra tiempo.',
        },
        {
          title: 'De SRT a VTT, tercer paso',
          text: 'Deja los números donde están, ya que VTT los permite como nombres de bloque. Guarda en UTF-8 con la extensión .vtt.',
        },
        {
          title: 'De VTT a SRT',
          text: 'Haz lo contrario: borra el encabezado, los bloques NOTE y cualquier ajuste que haya después de las horas, vuelve a cambiar los puntos por comas, asegúrate de que cada bloque tenga un número y guarda como .srt.',
        },
      ],
      after: [
        'Si tienes ffmpeg instalado, también convierte archivos de subtítulos: ffmpeg -i talk.srt talk.vtt convierte un archivo SRT en uno VTT, y el mismo comando con los nombres invertidos hace el camino contrario. Aun así, la vía más sencilla es descargar el formato que necesitas desde la página de la transcripción, porque ambos se generan directamente del mismo texto.',
      ],
    },
    {
      title: 'Problemas frecuentes y sus causas',
      bullets: [
        {
          title: 'Las tildes o las letras no latinas aparecen como símbolos extraños.',
          text: 'El archivo no está guardado en UTF-8. Vuelve a guardarlo con esa codificación.',
        },
        {
          title: 'No se muestra nada en la página web.',
          text: 'El archivo es SRT en lugar de VTT, o el servidor lo envía con el tipo equivocado. Los archivos VTT deben servirse como text/vtt, y un archivo alojado en otro dominio también necesita los ajustes de origen cruzado adecuados.',
        },
        {
          title: 'Los subtítulos salen tarde o pronto en todo el video.',
          text: 'Todo el archivo está desfasado. La mayoría de los reproductores y editores permiten desplazar los subtítulos un tiempo fijo, lo cual es más fácil que editar cada línea.',
        },
        {
          title: 'Dos subtítulos se superponen en pantalla.',
          text: 'La hora de fin de un bloque es posterior a la hora de inicio del siguiente. Acorta el bloque anterior.',
        },
        {
          title: 'Las líneas son demasiado largas para leerlas.',
          text: 'Divídelas en dos líneas de longitud parecida. Unos 42 caracteres por línea es una pauta habitual.',
        },
      ],
    },
    {
      title: 'Cómo conseguir aquí un archivo SRT o VTT a partir de tu video',
      paragraphs: [
        'No necesitas escribir ninguno de los dos formatos tú mismo. Añade tu archivo de video o de audio en la página de inicio, elige el idioma hablado y deja que la transcripción termine. Revísala y corrige cualquier palabra que esté mal: una línea editada conserva su hora de inicio y de fin, y las palabras que contiene se reparten a lo largo de ese tiempo en proporción a su longitud.',
        'Después abre el menú de descarga y elige SRT o VTT. Ambos se crean a partir de la misma transcripción editada, de modo que puedes exportar uno para YouTube y el otro para tu propia página web sin repetir ningún trabajo. Si quieres que los subtítulos se dividan limpiamente en las palabras correctas, deja activada la opción Marcas de tiempo por palabra en Más opciones.',
      ],
    },
  ],
  faqs: [
    {
      question: '¿Puedo cambiar el nombre de un archivo SRT a VTT y usarlo en mi sitio web?',
      answer:
        'No. Un navegador rechaza un archivo .vtt que no empiece por WEBVTT, y las horas de SRT usan comas donde VTT necesita puntos. Añade el encabezado, cambia las comas o descarga directamente un archivo VTT desde la página de la transcripción.',
    },
    {
      question: '¿Los archivos SRT y VTT se diferencian en tamaño o en calidad?',
      answer:
        'No. Los dos son archivos de texto pequeños y ninguno afecta a la calidad del video. La diferencia está solo en las cosas extra que VTT puede describir, como la posición en pantalla y el estilo, y en los lugares donde se acepta cada formato.',
    },
    {
      question: '¿Pueden los subtítulos SRT ir en negrita, en cursiva o de color?',
      answer:
        'Algunos reproductores entienden etiquetas básicas como b e i en SRT, pero el soporte es desigual, así que el resultado puede variar de un reproductor a otro. WebVTT define sus etiquetas y su estilo con CSS en una especificación, lo que hace el resultado más predecible en la web.',
    },
    {
      question: '¿Qué codificación de texto debe usar un archivo de subtítulos?',
      answer:
        'UTF-8. Admite todos los idiomas y es lo que los navegadores esperan para WebVTT. Si los caracteres de los subtítulos se ven rotos, casi con seguridad el archivo se guardó en una codificación más antigua.',
    },
  ],
  links: [
    {
      label: 'Generador de subtítulos SRT',
      path: '/srt-subtitle-generator',
      note: 'Sube un video y descarga un archivo SRT creado a partir del habla que contiene.',
    },
    {
      label: 'Generador de subtítulos VTT',
      path: '/vtt-subtitle-generator',
      note: 'Lo mismo, para un archivo WebVTT que funciona con el elemento de video de una página web.',
    },
    {
      label: 'Cómo añadir subtítulos a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Paso a paso, desde la transcripción hasta un video que muestra subtítulos en YouTube, VLC o un editor.',
    },
    {
      label: 'Generador de subtítulos para YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Crea un archivo SRT para un video tuyo y súbelo en YouTube Studio.',
    },
    {
      label: 'Cómo conseguir una transcripción más precisa',
      path: '/guides/accurate-transcripts',
      note: 'Un texto mejor significa menos correcciones antes de exportar los subtítulos.',
    },
  ],
};
