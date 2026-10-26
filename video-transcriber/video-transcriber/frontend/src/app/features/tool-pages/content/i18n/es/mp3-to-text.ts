import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 a texto',
  h1: 'Convertir MP3 a texto en línea',
  lead: 'Desde episodios de pódcast hasta grabaciones de clases y mensajes de voz, MP3 es el formato de audio del que casi todos tenemos montones. Sube un MP3 y obtén una transcripción con marcas de tiempo gratis, sin iniciar sesión.',
  dropKind: 'audio',
  dropNoun: 'archivo MP3',

  whyTitle: 'Qué te aporta la transcripción de un MP3',
  why: [
    'MP3 comprime el audio en un archivo pequeño, y por eso lo usan los pódcast, las grabadoras de voz y las clases descargadas. Eso también ayuda aquí: un MP3 se sube rápido incluso con una conexión lenta, y un MP3 de una hora a 128 kbps ocupa solo unos 58 MB.',
    'Una transcripción te permite buscar una frase en un episodio largo, citar a un entrevistado con exactitud, escribir las notas de un programa sin volver a escucharlo o conservar por escrito una charla o un mensaje de voz.',
  ],
  browserWhy: [
    'MP3 comprime el audio en un archivo pequeño, y por eso lo usan los pódcast, las grabadoras de voz y las clases descargadas. Eso también ayuda aquí: tu navegador lee un MP3 rápidamente, y un MP3 de una hora a 128 kbps ocupa solo unos 58 MB.',
    'Una transcripción te permite buscar una frase en un episodio largo, citar a un entrevistado con exactitud, escribir las notas de un programa sin volver a escucharlo o conservar por escrito una charla o un mensaje de voz.',
  ],

  howTitle: 'Cómo convertir un MP3 a texto',
  howToDescription:
    'Sube el MP3, elige el idioma hablado, espera la transcripción y descárgala como texto o subtítulos.',
  steps: [
    {
      title: 'Elige tu MP3',
      text: 'Suelta el .mp3 en el cuadro de la parte superior de esta página o pulsa Elegir un archivo. En el cargador puedes añadir más de uno, y cada uno se convierte en su propia transcripción.',
    },
    {
      title: 'Elige el idioma',
      text: 'Selecciona el idioma hablado o deja la detección automática. Para obtener texto en inglés a partir de otro idioma, abre Más opciones y pon Salida en Traducir al inglés.',
    },
    {
      title: 'Espera la transcripción',
      text: 'El texto aparece mientras se procesa el archivo, con una barra de progreso. Más rápido es veloz; Máxima precisión tarda más y comete menos errores.',
    },
    {
      title: 'Corrige y descarga',
      text: 'Corrige cualquier línea y descarga TXT para leer, o SRT y VTT si el audio va con un video o un reproductor web.',
    },
  ],

  formatsTitle: 'MP3 y otros formatos de audio',
  formatsIntro:
    'MP3 es el audio que más se sube. Estos otros formatos de audio funcionan igual, y también se aceptan archivos de video.',
  uploadTitle: 'Archivos de audio que puedes subir',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'el episodio o la charla como texto sin formato' },
    { name: 'Markdown', use: 'notas del programa con marcas de tiempo' },
    { name: 'SRT', use: 'subtítulos para una versión en video' },
    { name: 'VTT', use: 'una pista de transcripción para reproductores web' },
    { name: 'PDF', use: 'una transcripción para imprimir o enviar' },
    { name: 'JSON', use: 'líneas estructuradas para programas' },
  ],

  tipsTitle: 'Consejos para transcribir archivos MP3',
  tips: [
    {
      title: 'Sube la mejor copia.',
      text: 'MP3 pierde calidad al comprimir y cada nuevo guardado pierde un poco más de detalle. Si aún tienes el WAV o la grabación original, sube esa.',
    },
    {
      title: 'Evita las tasas de bits muy bajas.',
      text: 'La voz soporta bien la compresión, pero las tasas de bits muy bajas difuminan las consonantes y reducen la precisión.',
    },
    {
      title: 'Divide los episodios largos.',
      text: 'Un archivo que supera el límite de duración se rechaza. Corta un episodio de dos horas en partes con cualquier editor de audio antes de subirlo.',
      browser: {
        text: 'No hay límite de duración, pero un episodio de dos horas tarda un buen rato en un dispositivo lento. Córtalo en partes con cualquier editor de audio para leer antes la primera parte.',
      },
    },
    {
      title: 'Ocúpate de las introducciones y la música.',
      text: 'Deja activada la opción Omitir silencios y música en Más opciones, para que las sintonías y las pausas largas no produzcan palabras inventadas.',
    },
    {
      title: 'Deletrea a los invitados.',
      text: 'Escribe una vez el presentador, los invitados, el nombre del programa y las marcas en la pista de vocabulario, y será mucho más probable que salgan bien.',
    },
  ],

  faqs: [
    {
      question: '¿Cuánto puede durar un MP3?',
      answer:
        '{limits} Un MP3 de 60 minutos a 128 kbps ocupa unos 58 MB, así que el límite de duración importa más que el de tamaño. No hay cuota diaria ni mensual.',
      browser: {
        answer:
          'No ponemos límite de tamaño ni de duración, porque el MP3 se transcribe en tu navegador, en tu propio dispositivo. Un MP3 de 60 minutos a 128 kbps ocupa unos 58 MB; los archivos más largos simplemente tardan más, y la página te avisa si tu dispositivo es lento. No hay cuota diaria ni mensual.',
      },
    },
    {
      question: '¿La compresión del MP3 perjudica la precisión?',
      answer:
        'No mucho con una calidad normal, porque la voz es el caso fácil para el MP3. El ruido, el eco y las voces que se solapan perjudican mucho más que el formato, así que prefiere un original limpio cuando lo tengas.',
    },
    {
      question: '¿Puedo transcribir varios archivos MP3 a la vez?',
      answer:
        'Sí. Añádelos juntos y cada uno se convierte en su propia transcripción dentro de tu sesión, que puedes abrir y descargar por separado.',
    },
    {
      question: '¿Puedo traducir un MP3 al inglés?',
      answer:
        'Sí. En Más opciones pon Salida en Traducir al inglés. La traducción es automática, así que lee el texto en inglés antes de usarlo. No se ofrecen otros idiomas de destino.',
    },
    {
      question: '¿Se conserva mi MP3?',
      answer:
        'Solo durante tu sesión. Se elimina automáticamente cuando termina la sesión, o cuando pulsas Borrar mis datos ahora. No hace falta cuenta.',
      browser: {
        answer:
          'Solo en este navegador: tu MP3 nunca sale de tu dispositivo. Se elimina automáticamente tras un periodo de inactividad, o cuando pulsas Borrar mis datos ahora. No hace falta cuenta.',
      },
    },
  ],
};
