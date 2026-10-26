import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cómo añadir subtítulos a un video, gratis',
  lead: 'Crear subtítulos lleva cuatro pasos: convertir el habla en texto, corregir los errores, exportar un archivo SRT o VTT y asociar ese archivo al video. Esta guía recorre cada paso y muestra cómo adjuntar el archivo en YouTube, en VLC, en un editor de video, en una página web o de forma permanente en la imagen con ffmpeg.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Crea subtítulos a partir de tu video',
  blocks: [
    {
      title: 'Primero decide: subtítulos suaves o subtítulos incrustados',
      paragraphs: [
        'Hay dos maneras de poner subtítulos en un video, y la elección determina qué pasos necesitas.',
      ],
      bullets: [
        {
          title: 'Subtítulos suaves (una pista aparte).',
          text: 'Los subtítulos son un archivo o una pista junto al video. Los espectadores pueden activarlos y desactivarlos, elegir un idioma, y tú puedes corregir una errata más tarde sin tocar el video. Así funcionan YouTube, VLC, la mayoría de los reproductores y las páginas web. Necesita un reproductor que admita pistas de subtítulos.',
        },
        {
          title: 'Subtítulos incrustados (parte de la imagen).',
          text: 'El texto se dibuja en cada fotograma, así que se ve en todas partes, incluso en plataformas que no aceptan un archivo de subtítulos. El precio es que nadie puede desactivarlos, no puedes corregirlos sin exportar de nuevo el video y el video tiene que volver a codificarse.',
        },
      ],
      after: [
        'Si tienes dudas, empieza con subtítulos suaves. Incrústalos solo cuando el lugar donde publicas no permita subir subtítulos.',
      ],
    },
    {
      title: 'Los cuatro pasos de un vistazo',
      steps: [
        {
          title: 'Transcribe el video',
          text: 'Añade el video en la página de inicio, elige el idioma hablado y deja que el habla se convierta en texto con tiempos.',
        },
        {
          title: 'Corrige el texto',
          text: 'Lee la transcripción y corrige nombres, números y palabras poco claras. Si las líneas de los subtítulos salen demasiado largas, elige una Longitud de línea de los subtítulos más corta en el menú Exportar.',
        },
        {
          title: 'Exporta SRT o VTT',
          text: 'Descarga el archivo de subtítulos. SRT funciona casi en todas partes. VTT es para el elemento de video de una página web.',
        },
        {
          title: 'Asocia el archivo',
          text: 'Súbelo a YouTube, cárgalo en tu reproductor o editor, o añádelo a tu página. O incrústalo en el video.',
        },
      ],
    },
    {
      title: 'Pasos 1 y 2: transcribe el video y corrige el texto',
      paragraphs: [
        'Elige el video en la página de inicio y selecciona el idioma en que se habla, en lugar de dejarlo en detección automática. Indicar el idioma es más fiable, sobre todo en clips cortos y con acentos. La calidad Estándar sirve para la mayoría de los videos. Elige Alta precisión si el sonido tiene ruido o los acentos son marcados.',
        'Deja activadas las Marcas de tiempo por palabra en Más opciones. Vienen activadas de forma predeterminada y permiten que cada subtítulo empiece y termine con las palabras, en lugar de hacerlo en los bordes de un bloque largo. Cuando la transcripción esté lista, reproduce el video junto a ella y sigue la lectura. Las palabras de las que el reconocedor estaba menos seguro aparecen subrayadas mientras el interruptor Subrayar palabras dudosas esté activado (lo está de forma predeterminada), así que revisa esas primero.',
        'Los subtítulos se leen deprisa, así que da forma al texto pensando en el espectador. Estas son pautas muy extendidas, no reglas estrictas:',
      ],
      bullets: [
        {
          title: 'Longitud de línea.',
          text: 'Unos 42 caracteres por línea y no más de dos líneas a la vez. El menú Exportar tiene una opción de Longitud de línea de los subtítulos: Corta (32 letras), Estándar (42) o Larga (56).',
        },
        {
          title: 'Tiempo en pantalla.',
          text: 'Cada subtítulo debería permanecer al menos un segundo aproximadamente y rara vez más de unos siete.',
        },
        {
          title: 'Velocidad de lectura.',
          text: 'Entre 15 y 20 caracteres por segundo es cómodo para la mayoría de los adultos. Si la gente no termina de leer antes de que cambie la línea, acorta la redacción o deja el subtítulo más tiempo.',
        },
        {
          title: 'Cortes naturales.',
          text: 'Un buen subtítulo se corta al final de una frase, no a mitad de un nombre ni entre un artículo y su sustantivo. La exportación ajusta por ti las líneas largas, así que procura que cada línea editada sea una frase completa.',
        },
      ],
    },
    {
      title: 'Paso 3: elige SRT o VTT',
      paragraphs: [
        'Descarga SRT salvo que los subtítulos sean para un video de tu propia página web. YouTube, VLC y casi todos los editores aceptan SRT. Una página web necesita VTT, porque los navegadores solo leen las pistas de subtítulos en ese formato.',
        'Puedes descargar ambos a partir de la misma transcripción, así que no hace falta decidir de antemano. La guía sobre SRT y VTT explica las diferencias exactas, incluido lo que hay dentro de cada archivo.',
      ],
    },
    {
      title: 'Paso 4: añade el archivo a YouTube, VLC o un editor',
      paragraphs: [
        'Los nombres de los menús cambian de vez en cuando, así que busca la opción más parecida si alguna etiqueta difiere de la que se indica a continuación.',
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: 'Abre YouTube Studio, elige el video, abre Subtítulos, añade un idioma y luego elige subir un archivo. Escoge la opción de un archivo con tiempos, selecciona tu SRT y publica. YouTube te permite editar las líneas después en la misma pantalla.',
        },
        {
          title: 'VLC.',
          text: 'Reproduce el video y elige en el menú Subtítulo, Añadir archivo de subtítulos, y selecciona tu SRT. También puedes arrastrar el archivo a la ventana del reproductor. O guarda el SRT junto al video con el mismo nombre (lecture.mp4 y lecture.srt) y VLC suele cargarlo por sí solo.',
        },
        {
          title: 'Editores de video.',
          text: 'La mayoría de los editores pueden importar un archivo SRT como pista de títulos o de subtítulos, desde un menú como Archivo, Importar, o desde el panel de títulos. Una vez en la línea de tiempo, puedes cambiar el estilo del texto. Si rechazan un formato, prueba con el otro.',
        },
        {
          title: 'Teléfonos y tabletas.',
          text: 'Una aplicación de reproducción de video que admita archivos de subtítulos, como VLC para móvil, puede cargar un archivo SRT desde tus archivos. El reproductor de la galería integrada de muchos teléfonos no puede.',
        },
      ],
    },
    {
      title: 'Añadir subtítulos a una página web con el elemento track',
      paragraphs: [
        'En tu propio sitio web, el elemento video de HTML carga los subtítulos mediante un elemento track que apunta a un archivo WebVTT. Exporta VTT, súbelo junto al video y añade una línea.',
      ],
      code: {
        label: 'Un video con una pista de subtítulos',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English" default>
</video>`,
      },
      after: [
        'El atributo default muestra la pista sin que el espectador la elija. Añade una línea track por cada idioma. Si el archivo VTT está en un dominio distinto al de la página, ese servidor debe permitir las solicitudes de origen cruzado o el navegador no lo cargará.',
      ],
    },
    {
      title: 'Añadir una pista de subtítulos suaves a un MP4 con ffmpeg',
      paragraphs: [
        'ffmpeg es una herramienta gratuita de línea de comandos que puede empaquetar los subtítulos dentro del archivo MP4, de modo que el video y sus subtítulos viajen como un solo archivo. El video y el sonido se copian sin tocarlos, así que es rápido y no pierde calidad. Pon el video y el archivo SRT en una misma carpeta y ejecuta este comando ahí.',
      ],
      code: {
        label: 'Subtítulos suaves dentro de un MP4 (los espectadores pueden desactivarlos)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=eng talk-subtitled.mp4`,
      },
      after: [
        'Las opciones -map eligen exactamente qué entra en el archivo nuevo: todo el video, cualquier sonido (el signo de interrogación permite que el comando continúe si no hay) y el archivo de subtítulos. Elegir los flujos a mano evita errores con archivos de teléfono y de cámara que además contienen pistas de datos extra, que MP4 a menudo no puede copiar. El ajuste mov_text es el tipo de subtítulo que usan los archivos MP4. El código de idioma tiene tres letras: eng para inglés, spa para español, hin para hindi, y así sucesivamente. Reproductores como VLC muestran la pista en su menú de subtítulos.',
      ],
    },
    {
      title: 'Incrustar subtítulos en la imagen con ffmpeg',
      paragraphs: [
        'Para una plataforma que solo acepta un video, dibuja el texto en cada fotograma. Esto vuelve a codificar el video, así que tarda más y el archivo se genera de nuevo. El sonido se copia tal cual. Ejecútalo en la carpeta que contiene ambos archivos, lo que evita problemas con las rutas de archivo.',
      ],
      code: {
        label: 'Subtítulos incrustados (permanentes, no se pueden desactivar)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "Para cambiar el aspecto, añade un estilo después del nombre del archivo, por ejemplo subtitles=talk.srt:force_style='FontSize=22' dentro de las comillas del comando. Guarda una copia del video original, porque una versión con subtítulos incrustados no se puede volver a convertir en subtítulos suaves.",
      ],
    },
    {
      title: 'Accesibilidad, y por qué debes revisar el texto',
      paragraphs: [
        'Los subtítulos ayudan a las personas sordas o con dificultades auditivas, a quienes ven un video en el tren o en una oficina silenciosa con el sonido apagado, a quienes todavía están aprendiendo el idioma y a cualquiera que encuentre más fácil seguir las palabras escritas. Muchos espectadores los activan incluso cuando podrían oír el sonido.',
        'El reconocimiento de voz es bueno, pero no perfecto, y un subtítulo con un nombre o un número equivocado puede inducir a error. Lee siempre la transcripción frente al video antes de publicarla y pon especial cuidado con los nombres, las cifras, los términos técnicos y todo lo que sea legal o médico. Los subtítulos que además describen sonidos importantes, como una risa o una puerta que se cierra, son más útiles para quienes no pueden oírlos, y puedes añadirlos a mano mientras editas.',
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuál es la diferencia entre subtítulos y subtítulos para sordos?',
      answer:
        'Los subtítulos traducen o transcriben el habla para espectadores que pueden oír el video. Los subtítulos para sordos (captions, en inglés) describen además los sonidos, como la música o las risas, para espectadores que no pueden oír. Los archivos son del mismo tipo, así que puedes añadir descripciones de sonidos a un archivo SRT tú mismo si quieres ese resultado.',
    },
    {
      question: '¿Necesito un programa especial para añadir subtítulos?',
      answer:
        'No. Sube el archivo SRT en YouTube Studio, arrástralo a VLC o impórtalo en tu editor. Solo empaquetar el archivo dentro de un MP4, o incrustar el texto en la imagen, necesita una herramienta como ffmpeg o un editor de video que pueda exportarlo.',
    },
    {
      question: '¿Puedo añadir subtítulos en más de un idioma?',
      answer:
        'Sí, con subtítulos suaves. Crea un archivo por cada idioma y añade cada uno como una pista propia. Este sitio puede escribir la transcripción en el idioma hablado y puede traducir el habla al inglés, pero tendrías que traducir el texto a otros idiomas tú mismo o con otra herramienta.',
    },
    {
      question: '¿Por qué mis subtítulos no están sincronizados con el video?',
      answer:
        'O bien todo el archivo está desfasado, lo que la mayoría de los reproductores pueden corregir con un ajuste de retraso de subtítulos, o bien el video se editó después de crear los subtítulos. Los subtítulos siguen el tiempo del audio a partir del cual se crearon, así que transcribe la versión final del video.',
    },
  ],
  links: [
    {
      label: 'Generador de subtítulos SRT',
      path: '/srt-subtitle-generator',
      note: 'Empieza aquí para convertir un video en un archivo SRT.',
    },
    {
      label: 'SRT o VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Qué hay dentro de cada archivo y cuál descargar en tu caso.',
    },
    {
      label: 'Generador de subtítulos VTT',
      path: '/vtt-subtitle-generator',
      note: 'Consigue el archivo WebVTT que necesita el elemento de video de una página web.',
    },
    {
      label: 'Generador de subtítulos para YouTube',
      path: '/youtube-subtitle-generator',
      note: 'La vía específica de YouTube, desde el archivo hasta la subida en Studio.',
    },
    {
      label: 'Traducir habla al inglés',
      path: '/translate-audio-to-english',
      note: 'Obtén subtítulos en inglés a partir de un video hablado en otro idioma.',
    },
  ],
};
