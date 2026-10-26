/** Spanish dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
export const PAGES: readonly string[] = [
  '/',
  '/how-it-works',
  '/faq',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/tools',
  '/guides',
];

const dict: Record<string, string> = {
  '.': '.',
  '"{name}" is {size}; the limit is {limit}.': '"{name}" pesa {size}; el límite es {limit}.',
  '"{name}" is empty.': '"{name}" está vacío.',
  '"{name}" is ready. Press Transcribe to start.':
    '"{name}" está listo. Pulsa Transcribir para empezar.',
  '“{title}” was deleted.': 'Se eliminó “{title}”.',
  '(optional)': '(opcional)',
  '{base} Word timing: {timing}.': '{base} Tiempos por palabra: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) lo gestiona **{name}**, {address} ("nosotros"). Nosotros decidimos cómo y por qué se tratan tus datos, tal como se describe aquí.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) está a cargo de **{name}**, {address}. Más información en la página [Acerca de](/about).',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} es un servicio para el público general y no está dirigido a menores de 13 años (ni de 16 en la UE, donde corresponda).',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} lo ha creado y lo gestiona **{name}**, {role} con sede en {city}. Lo creé para ofrecer la mejor experiencia de transcripción posible: fluida desde el primer clic, sin cuenta que crear y con una interfaz limpia que no estorba.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} es para el público general y no está dirigido a menores de 13 años.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages) and beside a finished transcript. No ad is shown while a file is being transcribed, and never on the privacy, terms or logs pages.':
    '{brand} es gratis porque muestra anuncios, servidos por Google AdSense. Los anuncios aparecen solo en las páginas informativas (inicio, Cómo funciona, Preguntas frecuentes y las páginas de herramientas) y junto a una transcripción terminada. No se muestra ningún anuncio mientras se transcribe un archivo, ni nunca en las páginas de privacidad, términos o registros.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} es gratis. La [Política de privacidad](/privacy) explica qué ocurre con tus archivos.',
  '{brand} is funded by ads shown on its information pages and beside finished transcripts (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} se financia con los anuncios que se muestran en sus páginas informativas y junto a las transcripciones terminadas (Google AdSense). Como tu propio dispositivo hace la transcripción, no hay coste de servidor por cada archivo, y eso es lo que mantiene el servicio gratuito y sin límites. La [Política de privacidad](/privacy) explica qué usan los anuncios y cómo elegir tus ajustes.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} convierte la voz de un archivo de video o de audio en texto con marcas de tiempo, en tres sencillos pasos.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} convierte la voz de videos, archivos de audio y grabaciones de voz en texto preciso y con marcas de tiempo. Es gratis, no hay límite de archivos que puedes transcribir y no necesitas cuenta: elige un archivo arriba, pulsa Transcribir y lee el resultado.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages and beside finished transcripts (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} convierte archivos de video y de audio en texto, directamente en tu navegador: el reconocimiento se ejecuta en tu dispositivo y tus archivos no se suben a nuestros servidores. Es gratis y no necesita cuenta. Se financia con anuncios en las páginas informativas y junto a las transcripciones terminadas (Google AdSense; consulta la [Política de privacidad](/privacy)). Podemos cambiar, limitar o suspender funciones en cualquier momento.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} convierte video y audio en texto preciso y con marcas de tiempo, gratis. No hay registro, ni inicio de sesión, ni marca de agua: abre la página, elige un archivo y lee tu transcripción.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies.':
    '{brand} convierte video y audio en texto, directamente en tu navegador. Esta página explica, con palabras sencillas, qué implica eso para tus datos. En resumen: tu archivo nunca sale de tu dispositivo. Tus transcripciones se guardan solo en este navegador, no hay cuenta y el sitio no establece cookies propias. Los anuncios aparecen solo en las páginas informativas y junto a las transcripciones terminadas, y los sirve Google, que usa cookies.',
  '{done} of {total}': '{done} de {total}',
  '{duration} (estimate)': '{duration} (estimado)',
  '{gb} GB of memory recommended': 'Se recomiendan {gb} GB de memoria',
  '{h} h': '{h} h',
  '{h} h {m} min': '{h} h {m} min',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (el primer uso descarga {size} MB)',
  "{label}, as reported by visitors' browsers":
    '{label}, según informan los navegadores de los visitantes',
  '{label}: common questions': '{label}: preguntas frecuentes',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. Búscalo en tus descargas.',
  '{language} → English': '{language} → inglés',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} Ya se habían puesto en cola {done} de {total} archivos; quedan {left} en la lista, pulsa Transcribir para reintentar.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} Ya se habían puesto en cola {done} de {total} archivos; queda {left} en la lista, pulsa Transcribir para reintentar.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} funciona más lento que el tiempo real en este dispositivo: {wait} para {audio} de audio (estimado). Tiny o Base terminan antes.',
  '{n} files were skipped: not video or audio.':
    'Se omitieron {n} archivos: no son de video ni de audio.',
  '{n} h ago': 'hace {n} h',
  '{n} min': '{n} min',
  '{n} min ago': 'hace {n} min',
  '{n} min left': 'faltan {n} min',
  '{n} min read': '{n} min de lectura',
  '{n} minute': '{n} minuto',
  '{n} minutes': '{n} minutos',
  '{n} of {total}': '{n} de {total}',
  '{n} of those files are already in the list.': '{n} de esos archivos ya están en la lista.',
  '{n} video transcribed': '{n} video transcrito',
  '{n} videos transcribed': '{n} videos transcritos',
  '{n} words': '{n} palabras',
  '{n}% done': '{n}% completado',
  '{n}% model confidence': '{n}% de confianza del modelo',
  '{n}s left': 'faltan {n} s',
  '{name} home': 'Inicio de {name}',
  '{size} download': 'descarga de {size}',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} No disponible en este dispositivo: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**Un registro técnico en esta pestaña.** La página Registros muestra el registro técnico de esta pestaña. Se queda en tu navegador y nunca se envía a ningún sitio.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**Añade una pista de vocabulario**: nombres, marcas y jerga que aparezcan en el audio, escritos como quieres verlos.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**Añade una pista de vocabulario**: nombres, marcas y jerga, escritos como quieres verlos.',
  '**Ads.** Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed.':
    '**Anuncios.** Los anuncios aparecen solo en las páginas informativas y junto a las transcripciones terminadas, y los sirve Google, que usa cookies. No se muestra ningún anuncio mientras se transcribe un archivo.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**Revisa las líneas marcadas** y corrígelas en el editor de la transcripción.',
  '**Choose the spoken language** instead of auto-detect.':
    '**Elige el idioma hablado** en lugar de la detección automática.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**Elige tu archivo.** Suelta un archivo de video o de audio arriba, elige uno de tu dispositivo o graba tu voz con el micrófono. Funcionan MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG y la mayoría de los demás formatos habituales.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**Mejorar el audio** — filtra zumbidos y siseos, y equilibra a las personas que hablan bajo',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**Límites de archivo.** No ponemos ninguno. Tu archivo se procesa en tu dispositivo, así que los archivos muy grandes o largos tardan más y necesitan suficiente memoria libre; la página te avisa en un dispositivo más lento.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**Tipos de archivo.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS y MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG y OPUS. También puedes grabar directamente desde tu micrófono.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Cookies de Google.** Google establece sus propias cookies cuando se cargan los anuncios, solo en las páginas que muestran anuncios (véase la sección 6).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**Clases y pódcast** convertidos en texto legible para estudiar o para las notas del episodio.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**Límites.** Ahora mismo el servidor no anuncia ningún límite de tamaño ni de duración. Los archivos muy grandes simplemente tardan más.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**Límites.** No ponemos ningún límite de tamaño ni de duración: tu archivo se procesa en tu dispositivo, así que los archivos muy grandes o largos simplemente tardan más y necesitan suficiente memoria libre. En un dispositivo más lento, la página te lo dice antes de empezar y estima el tiempo.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**Los archivos que añades.** Los archivos de video o de audio que eliges o grabas. Se procesan en tu navegador, en tu dispositivo (con WebGPU o WebAssembly). Tu archivo nunca se sube a nuestros servidores y nunca se envía a Google ni a nadie más.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**Notas de reuniones y entrevistas** en las que puedes buscar, citar y que puedes compartir.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**Se cometen errores.** Ningún reconocimiento de voz es perfecto. Verifica siempre una transcripción antes de fiarte de ella para algo importante.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**Sin cookies propias.** El sitio en sí no establece cookies.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Nada se guarda para más adelante.** Los archivos y las transcripciones existen solo durante tu sesión. Exporta lo que necesites antes de irte. Los detalles están en la [Política de privacidad](/privacy).',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Nada se guarda para más adelante.** Las transcripciones y el archivo se quedan solo en este navegador y se borran automáticamente tras {idle} de inactividad, o cuando pulsas **Borrar mis datos ahora**. Exporta lo que necesites antes de irte. Los detalles están en la [Política de privacidad](/privacy).',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**Nada se guarda para más adelante.** Las transcripciones existen solo durante esta sesión, así que exporta lo que necesites. La [Política de privacidad](/privacy) describe el sitio web alojado.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**Un contador total.** Cuando termina una transcripción, tu navegador envía un único "+1" anónimo a nuestro contador (un Cloudflare Worker). No lleva ningún archivo, transcripción ni identificador. Cloudflare ve tu dirección IP en tránsito y la usa brevemente para limitar abusos (un límite de frecuencia); nosotros guardamos solo el total. El número que se muestra en el encabezado lo informan los navegadores de los visitantes y no está verificado.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '**Elige Alta precisión o Máxima precisión** para audio difícil.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**Elige la calidad y el idioma.** Un modelo más rápido da un borrador rápido; uno más preciso es mejor para entrevistas, clases y subtítulos. El idioma hablado se puede detectar por ti, y se admiten más de 50 idiomas.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '**Vuelve a transcribir** una transcripción terminada con otra calidad u otro idioma; se conserva tu transcripción actual.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '**Vuelve a transcribir** con otra calidad u otro idioma; se conserva tu transcripción actual.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**Lee, corrige y descarga.** La transcripción aparece con marcas de tiempo, y las palabras de las que el modelo no estaba seguro están marcadas para que puedas revisarlas. Descárgala como texto sin formato, subtítulos SRT o VTT, Markdown o JSON.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**Solicitudes que entregan el sitio web.** Cloudflare (Cloudflare Pages) entrega este sitio web. Como nuestro proveedor de alojamiento y de red, procesa tu dirección IP y los datos habituales de la solicitud (como la hora, la página solicitada y tu navegador) para entregar y proteger el sitio.',
  '**Skip silence & music** — prevents made-up text':
    '**Omitir silencios y música** — evita texto inventado',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**Los modelos de voz se quedan en la caché de tu navegador** (Cache Storage), así que la siguiente transcripción empieza más rápido, hasta que los borres (**Borrar mis datos ahora** también puede borrarlos) o tu navegador limpie su almacenamiento. Son archivos de programa, no tus datos.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**Velocidad.** Depende de la calidad que elijas, de la duración del archivo y de lo ocupado que esté el servicio.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**Velocidad.** Depende de tu dispositivo, de la calidad que elijas y de la duración del archivo. El primer uso de un nivel de calidad descarga su modelo una vez: tu navegador obtiene los archivos del modelo de Hugging Face y los archivos de programa del motor de jsDelivr, y luego los mantiene en caché. Mantén la pestaña abierta mientras funciona.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**Parte de un buen audio**: menos ruido de fondo, un micrófono cercano y una sola persona hablando a la vez. Deja activada la opción "Mejorar el audio".',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**Parte de un buen audio**: poco ruido de fondo, un micrófono cercano, una persona a la vez. Deja activada la opción "Mejorar el audio".',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**Almacenamiento en tu navegador.** Tu navegador guarda tus transcripciones y archivos (IndexedDB) y los modelos de voz (Cache Storage) como se describe arriba, recuerda tu elección de tema claro u oscuro, y su almacenamiento de sesión guarda algunos ajustes de comodidad para la pestaña actual (como tu última elección de calidad). Nada de esto se nos envía.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**Subtítulos** para tus propios videos, reels y cursos en línea, a partir de un archivo SRT o VTT.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**Texto creado en tu dispositivo.** La transcripción, sus marcas de tiempo y tus ediciones, el título que elijas y los ajustes que selecciones (calidad, idioma, pista de vocabulario). Se crean y se guardan en este navegador; nunca los recibimos.',
  '**Use previous text as context** — can repeat on long files':
    '**Usar el texto anterior como contexto** — puede repetir texto en archivos largos',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**Notas de voz** escritas, para que no tengas que volver a escucharlas.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**¿Por qué pueden variar los resultados entre ejecuciones, ajustes de calidad u otras herramientas?** El reconocimiento de voz es probabilístico: elige las palabras más probables y, en pasajes con ruido o ambiguos, varias respuestas se parecen mucho. Un ajuste de calidad o de idioma distinto, otra pista de vocabulario o una limpieza de audio diferente pueden cambiar el texto, y también otra herramienta que use un sistema distinto. No se añaden nombres ni etiquetas de quien habla.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**Tiempos por palabra** — mejores subtítulos y marcas de confianza',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**Tus archivos y transcripciones se quedan en este navegador.** Las transcripciones, las ediciones y el archivo de origen se guardan solo en el almacenamiento de este navegador (IndexedDB). Se borran automáticamente cuando termina tu sesión, lo que ocurre tras {idle} de inactividad, o al instante cuando pulsas **Borrar mis datos ahora** en el menú Transcripciones.',
  '1 file was skipped: not video or audio.': 'Se omitió 1 archivo: no es de video ni de audio.',
  '1 minute': '1 minuto',
  '1 word': '1 palabra',
  '1. Agreement': '1. Acuerdo',
  '1. Who runs this website': '1. Quién gestiona este sitio web',
  '10. Children': '10. Menores',
  '10. Termination': '10. Terminación',
  '11. Children': '11. Menores',
  '11. Your rights and choices': '11. Tus derechos y opciones',
  '12. Changes': '12. Cambios',
  '12. Open-source components': '12. Componentes de código abierto',
  '13. Changes to this policy': '13. Cambios en esta política',
  '13. Governing law': '13. Ley aplicable',
  '14. Contact': '14. Contacto',
  '2. The service': '2. El servicio',
  '2. What is processed, and where': '2. Qué se trata y dónde',
  '3 simple steps': '3 sencillos pasos',
  '3. Why it is processed': '3. Por qué se trata',
  '3. Your content': '3. Tu contenido',
  '4. Acceptable use': '4. Uso aceptable',
  '4. How long it is kept': '4. Cuánto tiempo se conserva',
  '5. Downloads your browser makes': '5. Descargas que hace tu navegador',
  '5. Limits: your device does the work': '5. Límites: el trabajo lo hace tu dispositivo',
  '6. Accuracy: no warranty': '6. Precisión: sin garantía',
  '6. Advertising': '6. Publicidad',
  '7. Availability': '7. Disponibilidad',
  '7. Cookies and browser storage': '7. Cookies y almacenamiento del navegador',
  '8. Sharing': '8. Con quién se comparte',
  '8. Third-party downloads and ads': '8. Descargas de terceros y anuncios',
  '9. Liability': '9. Responsabilidad',
  '9. Security': '9. Seguridad',
  'A name cannot be empty, so the old name was kept.':
    'El nombre no puede estar vacío, así que se conservó el anterior.',
  'A new transcript has started. The old one is kept in your list.':
    'Ha empezado una nueva transcripción. La anterior se conserva en tu lista.',
  'a period': 'un periodo',
  About: 'Acerca de',
  'About {brand}': 'Acerca de {brand}',
  'about {h} h': 'unas {h} h',
  'about {h} h {m} min': 'unas {h} h {m} min',
  'about {n} min': 'unos {n} min',
  'Accurate text': 'Texto preciso',
  'Add another file': 'Añadir otro archivo',
  'Add your file': 'Añade tu archivo',
  'Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'Los anuncios aparecen solo en las páginas informativas y junto a las transcripciones terminadas, y los sirve Google, que usa cookies. No se muestra ningún anuncio mientras se transcribe un archivo, y este sitio web no establece cookies propias. Los detalles están en la [Política de privacidad](/privacy).',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'Ninguna función necesita los anuncios: si los bloqueas o los rechazas, todo funciona igual.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'Los anuncios mantienen TranscribeVid gratis. Todo funciona sin ellos.',
  Advertisement: 'Publicidad',
  'All free tools': 'Todas las herramientas gratuitas',
  'All free video and audio to text tools':
    'Todas las herramientas gratuitas de video y audio a texto',
  'All tools': 'Todas las herramientas',
  'All your data was deleted': 'Se borraron todos tus datos',
  'Allow the microphone in your browser, or choose a file instead.':
    'Permite el micrófono en tu navegador o elige un archivo.',
  'Already added': 'Ya añadido',
  'Already finished': 'Ya terminada',
  'Also delete the downloaded speech models?': '¿Borrar también los modelos de voz descargados?',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'Hay una carga en curso. Espera a que termine antes de añadir más archivos.',
  'Apply style only': 'Aplicar solo el estilo',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'Aplicar solo el estilo usa el reconocimiento guardado sin volver a procesar el audio. Se conservan las líneas editadas.',
  'Audio works too.': 'El audio también funciona.',
  'Automatic (IndicXlit when installed)': 'Automático (IndicXlit cuando está instalado)',
  Back: 'Atrás',
  'Basic phonetic spelling': 'Ortografía fonética básica',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'Como no tenemos ninguna cuenta ni datos que te identifiquen, normalmente no podemos vincular ningún dato a una persona. Cuando la ley te da derechos sobre tus datos personales, como acceso, rectificación, supresión, limitación, oposición y portabilidad, o el derecho a presentar una reclamación ante tu autoridad de protección de datos, puedes ejercerlos poniéndote en contacto con nosotros:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'Como tus transcripciones existen solo en este navegador, exporta lo que necesites antes de irte. Los datos borrados no se pueden recuperar.',
  'Best accuracy': 'Máxima precisión',
  'Best accuracy, slowest': 'Máxima precisión, la más lenta',
  Breadcrumb: 'Ruta de navegación',
  'By file type': 'Por tipo de archivo',
  'By language': 'Por idioma',
  'By use': 'Por uso',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'Al usar {brand} ({domain}) aceptas estos términos. Si no estás de acuerdo, no uses el servicio. El servicio lo gestiona **{name}**, {address}.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'eludir o intentar eludir los límites de frecuencia o la seguridad del sitio web o de su contador, ni interferir en su funcionamiento o en el uso que otros visitantes hacen de él;',
  'Can I edit the transcript?': '¿Puedo editar la transcripción?',
  "Can't reach the server.": 'No se puede conectar con el servidor.',
  Cancel: 'Cancelar',
  'Cancel "{title}"?': '¿Cancelar "{title}"?',
  'Cancel {title}': 'Cancelar {title}',
  'Cancellation requested': 'Cancelación solicitada',
  Cancelled: 'Cancelada',
  'Cancelling…': 'Cancelando…',
  'Cannot reach the server': 'No se puede conectar con el servidor',
  'Cannot reach the server.': 'No se puede conectar con el servidor.',
  'Cannot reach the server. Check your connection and try again.':
    'No se puede conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'No se puede conectar con el servidor. Comprueba que está en marcha (npm run dev) e inténtalo de nuevo.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'Cambia o elimina una línea, o busca y reemplaza. Tus ediciones están en cada descarga.',
  'Changed in {n} lines.': 'Cambiado en {n} líneas.',
  'Check Hinglish spelling': 'Revisa la ortografía del hinglish',
  'Choose "Save as PDF" in the print dialog.':
    'Elige "Guardar como PDF" en el cuadro de impresión.',
  'Choose a file': 'Elegir un archivo',
  'Choose a file first': 'Elige un archivo primero',
  'Choose a format': 'Elige un formato',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'Elige entre modelos más rápidos o más precisos, según tu dispositivo y el tiempo que tengas.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'Elige Más rápido, Estándar, Alta precisión o Máxima precisión: Más rápido es el más veloz y Máxima precisión comete menos errores.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'Elige el idioma hablado o déjalo en detección automática. También puedes traducir la voz al inglés.',
  'Chosen files': 'Archivos elegidos',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'Una voz clara y cerca del micrófono da el mejor resultado. En Más opciones, **Mejorar el audio** y **Omitir silencios y música** vienen activadas de forma predeterminada: filtran zumbidos y siseos e impiden que el modelo invente texto durante la música o las pausas largas, así que déjalas activadas en grabaciones con ruido. Para los subtítulos, deja también activados los **Tiempos por palabra**, para que cada línea empiece y termine exactamente con las palabras.',
  Close: 'Cerrar',
  'Close menu': 'Cerrar el menú',
  'Close: {title}': 'Cerrar: {title}',
  'Common questions': 'Preguntas frecuentes',
  Contact: 'Contacto',
  'Converting…': 'Convirtiendo…',
  Copied: 'Copiado',
  'Copy text': 'Copiar el texto',
  'Copying…': 'Copiando…',
  'Could not cancel the transcript.': 'No se pudo cancelar la transcripción.',
  'Could not change transcript style.': 'No se pudo cambiar el estilo de la transcripción.',
  'Could not copy': 'No se pudo copiar',
  'Could not delete the transcript.': 'No se pudo borrar la transcripción.',
  'Could not delete your data.': 'No se pudieron borrar tus datos.',
  'Could not load the text to copy.': 'No se pudo cargar el texto que copiar.',
  'Could not prepare the file. Please try again.':
    'No se pudo preparar el archivo. Inténtalo de nuevo.',
  'Could not rename the transcript.': 'No se pudo cambiar el nombre de la transcripción.',
  'Could not save the change.': 'No se pudo guardar el cambio.',
  'Could not start': 'No se pudo iniciar',
  'Could not start.': 'No se pudo iniciar.',
  Dark: 'Oscuro',
  Delete: 'Borrar',
  'Delete "{title}" and its transcript?': '¿Borrar "{title}" y su transcripción?',
  'Delete "{title}"? This cannot be undone.': '¿Borrar "{title}"? No se puede deshacer.',
  'Delete {title}': 'Borrar {title}',
  'Delete all your transcripts and the files kept in this browser now?':
    '¿Borrar ahora todas tus transcripciones y los archivos guardados en este navegador?',
  'Delete all your transcripts and uploaded files now?':
    '¿Borrar ahora todas tus transcripciones y los archivos subidos?',
  'Delete line': 'Borrar línea',
  'Delete my data now': 'Borrar mis datos ahora',
  'Delete this line from the transcript?': '¿Borrar esta línea de la transcripción?',
  'Delete transcript': 'Borrar transcripción',
  Deleted: 'Borrado',
  'Detect automatically': 'Detectar automáticamente',
  'Dismiss message': 'Descartar el mensaje',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 solo entiende voz en inglés. Elige otro modelo para traducir.',
  Done: 'Hecho',
  'Download failed': 'Falló la descarga',
  'Download started': 'Descarga iniciada',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'Descarga el resultado como texto sin formato, subtítulos SRT o VTT, Markdown o JSON.',
  'Download the transcript as': 'Descarga la transcripción como',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'Descargando el modelo de voz (solo la primera vez): {loaded} de {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'Suelta un archivo de video o de audio en la [página de inicio](/) o graba desde tu micrófono.',
  'Drop to add your file': 'Suelta para añadir tu archivo',
  'Drop your {noun} here, or choose a file': 'Suelta tu {noun} aquí o elige un archivo',
  'Each line with its time, like [00:12]': 'Cada línea con su hora, como [00:12]',
  Edit: 'Editar',
  'Edit it right here': 'Edítala aquí mismo',
  'Edit this line': 'Editar esta línea',
  'Edited by you': 'Editado por ti',
  'English only, very fast and accurate': 'Solo inglés, muy rápido y preciso',
  'English translation is selected in More options.':
    'La traducción al inglés está seleccionada en Más opciones.',
  'Enter saves · Esc cancels': 'Intro guarda · Esc cancela',
  'Every line has a time. Play the media from any line to hear what was said.':
    'Cada línea tiene su hora. Reproduce el archivo desde cualquier línea para oír lo que se dijo.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'Todas las páginas hacen el mismo trabajo: convierten la voz de un archivo de video o de audio en texto con una marca de tiempo en cada línea, en más de 50 idiomas y sin registro. Elige la que corresponda al archivo que tienes o a lo que quieres crear.',
  'Experimental: compare on your audio; chunk timestamps':
    'Experimental: compáralo con tu audio; marcas de tiempo por fragmento',
  'Experimental: larger model; chunk timestamps':
    'Experimental: modelo más grande; marcas de tiempo por fragmento',
  Export: 'Exportar',
  Failed: 'Falló',
  FAQ: 'FAQ',
  Fast: 'Rápido',
  'Fast, clean audio': 'Rápido, audio limpio',
  Fastest: 'Más rápido',
  'Fastest, rough drafts only': 'El más rápido, solo borradores',
  'Fewer mistakes. Takes longer.': 'Menos errores. Tarda más.',
  'Fewest mistakes. Takes the longest.': 'Los menos errores posibles. Es lo más lento.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'El archivo "{name}" pesa {size}; el límite es {limit}: configura VT_MAX_UPLOAD_MB para subirlo',
  'File "{name}" is {size}; the limit is {limit}.':
    'El archivo "{name}" pesa {size}; el límite es {limit}.',
  'file {n} of {total}': 'archivo {n} de {total}',
  'File added': 'Archivo añadido',
  'File limits.': 'Límites de archivo.',
  'File not added': 'Archivo no añadido',
  'File skipped': 'Archivo omitido',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'Los archivos y las transcripciones existen solo durante tu sesión. Exporta lo que necesites antes de irte. Lo único que conservamos es un total anónimo de cuántos archivos se han transcrito en el sitio (un solo número, que se muestra en el encabezado de la página); no está vinculado a ti, a tus archivos ni a tu sesión. Los detalles están en la [Política de privacidad](/privacy).',
  'Find it automatically': 'Encontrarlo automáticamente',
  'first time only, also downloads the {size} MB word-timing model':
    'solo la primera vez; también descarga el modelo de tiempos por palabra de {size} MB',
  'First time only: downloads {size} (needs internet)':
    'Solo la primera vez: descarga {size} (necesita internet)',
  'Follow playback': 'Seguir la reproducción',
  'Following playback': 'Siguiendo la reproducción',
  Footer: 'Pie de página',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'Para voces con acento o con varios idiomas mezclados, prueba una calidad más alta. La puntuación de confianza no es un porcentaje de precisión.',
  'For developers: words, times, confidence': 'Para desarrolladores: palabras, tiempos, confianza',
  'For notes apps': 'Para aplicaciones de notas',
  'For video players and editors': 'Para reproductores y editores de video',
  'For YouTube and web video': 'Para YouTube y video web',
  Free: 'Gratis',
  'Free tools': 'Herramientas gratuitas',
  'Free tools:': 'Herramientas gratuitas:',
  'Free video and audio to text': 'Video y audio a texto gratis',
  'Free video and audio to text, right in your browser':
    'Video y audio a texto gratis, directamente en tu navegador',
  'Free, unlimited, and no login needed': 'Gratis, sin límites y sin necesidad de registro',
  'Free, unlimited, no login': 'Gratis, sin límites, sin registro',
  'Frequently asked questions': 'Preguntas frecuentes',
  'Get in touch': 'Ponte en contacto',
  'Getting the speech engine ready…': 'Preparando el motor de voz…',
  'Give it a new name': 'Ponle un nombre nuevo',
  'Go to the home page': 'Ir a la página de inicio',
  'Go to Video to text': 'Ir a Video a texto',
  'Good balance (default)': 'Buen equilibrio (predeterminado)',
  'Good for most videos. Not sure? Keep this one.':
    'Bueno para la mayoría de los videos. ¿No estás seguro? Deja este.',
  'Good to know': 'Conviene saber',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'No se pudo cargar la herramienta de consentimiento de Google, probablemente porque un bloqueador de anuncios o la red lo impidió. Sin ella no se cargan anuncios ni cookies de anuncios.',
  Guides: 'Guías',
  'Guides: transcripts and subtitles': 'Guías: transcripciones y subtítulos',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    '¿Tienes una pregunta, has encontrado un error o quieres proponer una función? Escribe a {email}. Cada mensaje lo lee la persona que crea {brand}, y normalmente recibirás respuesta en unos pocos días laborables.',
  'Helps spell uncommon words correctly.': 'Ayuda a escribir bien las palabras poco comunes.',
  'High accuracy': 'Alta precisión',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'Alta precisión (Large v3 Turbo) no se entrenó para traducir y puede darte el idioma original. Para traducir elige Estándar o Máxima precisión.',
  'High accuracy, slower': 'Alta precisión, más lenta',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'Un valor mayor es algo más preciso y más lento. 5 es un buen valor predeterminado.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'Hindi en letras latinas, conservando las palabras en inglés. Los demás idiomas mantienen su escritura original. Revisa las palabras y los nombres poco habituales.',
  'Hinglish (Roman Hindi)': 'Hinglish (hindi romanizado)',
  'Hinglish conversion': 'Conversión a hinglish',
  History: 'Historial',
  Home: 'Inicio',
  'How {brand} works': 'Cómo funciona {brand}',
  'How accurate is it?': '¿Qué precisión tiene?',
  'How do I get better accuracy?': '¿Cómo consigo más precisión?',
  'How it stays free': 'Cómo se mantiene gratis',
  'How it works': 'Cómo funciona',
  'How long does it take?': '¿Cuánto tarda?',
  'How to transcribe a video to text': 'Cómo transcribir un video a texto',
  'How to turn a video or audio file into text with {brand}':
    'Cómo convertir un archivo de video o de audio en texto con {brand}',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'Si sí tiene voz, prueba Más › Volver a transcribir con el idioma correcto.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'Si el servicio está ocupado o ya hay demasiadas transcripciones en marcha, te pide que esperes y te dice por qué.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'Si cambiamos esta política, la nueva versión aparecerá en esta página con una nueva fecha de "Última actualización".',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'En el EEE, el Reino Unido y Suiza, y en algunos estados de EE. UU., el mensaje de consentimiento certificado de Google te pide tu elección cuando se cargan los anuncios.',
  'IndicXlit (trained model)': 'IndicXlit (modelo entrenado)',
  'Is it really free and unlimited? Do I need to log in?':
    '¿Es realmente gratis y sin límites? ¿Tengo que iniciar sesión?',
  'Is my data private?': '¿Mis datos son privados?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'Depende de la calidad que elijas, de la duración del archivo y de lo ocupado que esté el servicio. Más rápido es veloz; Máxima precisión tarda más pero comete menos errores. El progreso y el tiempo restante se muestran en directo, y un archivo que espera su turno muestra "Esperando en la cola".',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'Depende de tu dispositivo, de la calidad que elijas y de la duración del archivo. Con un chip gráfico potente (WebGPU) es lo más rápido; si no, se ejecuta en el procesador (WebAssembly), que es más lento. Más rápido es veloz; Máxima precisión tarda más pero comete menos errores. El progreso y el tiempo restante se muestran en directo.',
  'It is now called “{title}”.': 'Ahora se llama “{title}”.',
  'It may have been deleted.': 'Puede que se haya borrado.',
  'It was stopped before any text was found.': 'Se detuvo antes de encontrar texto.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'Sus datos se borraron, incluida esta transcripción. Las transcripciones solo se conservan durante la sesión que las creó.',
  'Job not found': 'Trabajo no encontrado',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'ahora mismo',
  'Just the words, in paragraphs': 'Solo las palabras, en párrafos',
  'Keep reading': 'Sigue leyendo',
  'Keep this page open until the upload is done.':
    'Mantén esta página abierta hasta que termine la carga.',
  'Kept only for this session, then deleted automatically.':
    'Se conserva solo durante esta sesión y luego se borra automáticamente.',
  Language: 'Idioma',
  'Larger or longer files are refused before they are processed, so split them first.':
    'Los archivos más grandes o más largos se rechazan antes de procesarlos, así que divídelos primero.',
  'Last updated: {date}': 'Última actualización: {date}',
  'Licence text': 'Texto de la licencia',
  Light: 'Claro',
  'Limits.': 'Límites.',
  'Line deleted': 'Línea borrada',
  'Live: the text appears here as it is recognised':
    'En directo: el texto aparece aquí a medida que se reconoce',
  'Loading model… (first use downloads it)': 'Cargando el modelo… (el primer uso lo descarga)',
  'Loading…': 'Cargando…',
  'Long (56 letters)': 'Larga (56 letras)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'Respuestas más largas: formatos, subtítulos, precisión y privacidad.',
  Main: 'Principal',
  'Make a new transcript of the same file. This one is kept.':
    'Crea una transcripción nueva del mismo archivo. Esta se conserva.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'Crea un archivo de subtítulos (SRT o VTT) a partir de tu video.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'Menú',
  Model: 'Modelo',
  More: 'Más',
  'More answers: [Frequently asked questions](/faq)':
    'Más respuestas: [Preguntas frecuentes](/faq)',
  'More free tools': 'Más herramientas gratuitas',
  'More options': 'Más opciones',
  'More than 50 languages': 'Más de 50 idiomas',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'Más de 50 idiomas, entre ellos inglés, español, francés, alemán, portugués, italiano, neerlandés, ruso, árabe, hindi, chino, japonés y coreano. Deja el idioma en detección automática o elígelo tú. También puedes traducir la voz al inglés.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'La mayoría de los sitios de transcripción te piden crear una cuenta, limitan los minutos gratuitos, añaden marcas de agua o te empujan a una suscripción antes de que veas una sola línea de texto. {brand} hace lo contrario. Todo lo que ofrece está disponible para todos, y la página no te pide nada más que tu archivo.',
  'Name not changed': 'Nombre no cambiado',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'Nombres, marcas y jerga del audio, p. ej. Kubernetes, Dr. Okafor',
  'Near-best accuracy, much faster than Large':
    'Casi la máxima precisión, mucho más rápido que Large',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'necesita compatibilidad con sombreadores de 16 bits (shader-f16) en el controlador gráfico',
  'needs 4 GB': 'necesita 4 GB',
  'needs 8 GB': 'necesita 8 GB',
  'needs a graphics-capable browser (Chrome, Edge)':
    'necesita un navegador compatible con gráficos (Chrome, Edge)',
  'needs WebGPU': 'necesita WebGPU',
  'Next match': 'Siguiente coincidencia',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'Sin cuenta y sin seguimiento. Tus archivos se conservan solo durante tu sesión y se borran automáticamente.',
  'no estimate for this model here': 'aquí no hay estimación para este modelo',
  'No login': 'Sin registro',
  'No matches': 'Sin coincidencias',
  'No microphone': 'Sin micrófono',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'Sin registro, sin pagos, sin límite diario. Solo añade tu archivo.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'Ahora mismo el servidor no anuncia ningún límite de tamaño ni de duración. Los archivos muy grandes simplemente tardan más.',
  'No speech was found in this file.': 'No se encontró voz en este archivo.',
  'No speech was transcribed.': 'No se transcribió ninguna voz.',
  'No speech was transcribed. Check the recording and the selected language.':
    'No se transcribió ninguna voz. Revisa la grabación y el idioma seleccionado.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'Aquí no hay WebGPU: los modelos se ejecutan en un solo hilo de la CPU, así que los tamaños mayores son más lentos que el tiempo real.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'No hay archivos de nadie más por delante del tuyo. Si añades varios archivos, se transcriben uno tras otro en tu pestaña, así que mantén la pestaña abierta hasta que terminen.',
  'None of those are video or audio files.': 'Ninguno de esos es un archivo de video ni de audio.',
  Normal: 'Normal',
  'not available for this size': 'no disponible para este tamaño',
  'not available in this browser': 'no disponible en este navegador',
  'not available with Qwen (times are per chunk)':
    'no disponible con Qwen (los tiempos son por fragmento)',
  'Not cancelled': 'No cancelada',
  'Not deleted': 'No borrado',
  'Not renamed': 'Sin cambiar de nombre',
  'Not saved': 'No guardado',
  Note: 'Nota',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'Aún no hay nada. Las transcripciones que crees aparecerán aquí durante esta sesión.',
  'Nothing is saved. Export what you need.': 'No se guarda nada. Exporta lo que necesites.',
  'Nothing is uploaded until you press Transcribe.':
    'No se sube nada hasta que pulses Transcribir.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'Nada de registro y nada que pagar. Solo añade tu archivo.',
  'Nothing was recorded.': 'No se grabó nada.',
  Off: 'Desactivado',
  On: 'Activado',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'Con voz clara en un idioma admitido suele ser muy preciso, pero ningún reconocimiento de voz es perfecto. La precisión depende de la calidad del audio, los acentos, el ruido de fondo, las voces que se solapan, la música y los nombres raros o la jerga. Cada línea tiene una puntuación de confianza, y las líneas de baja confianza están marcadas para que las revises primero. Verifica siempre una transcripción antes de fiarte de ella para algo importante.',
  'Open menu': 'Abrir el menú',
  'Opening your transcript…': 'Abriendo tu transcripción…',
  'or drop it anywhere on this page.': 'o suéltalo en cualquier parte de esta página.',
  'Original script': 'Escritura original',
  Output: 'Salida',
  'Page {page} of {pages}': 'Página {page} de {pages}',
  'Page not found': 'Página no encontrada',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'Páginas para el archivo que ya tienes: WAV, M4A, WebM y MOV.',
  'PDF document (.pdf)': 'Documento PDF (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'El PDF lo crea tu navegador: elige "Guardar como PDF" en el cuadro de impresión.',
  'Pick quality': 'Elige la calidad',
  'Plain text (.txt)': 'Texto sin formato (.txt)',
  'Play from here': 'Reproducir desde aquí',
  'Playback speed': 'Velocidad de reproducción',
  'Please add one file at a time here. You can add more files on the next page.':
    'Añade un archivo cada vez aquí. Puedes añadir más archivos en la página siguiente.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'Por favor, no envíes grabaciones privadas. {brand} transcribe tus archivos en tu propio dispositivo y nosotros nunca los recibimos, así que no los necesitamos para ayudarte.',
  'Please note': 'Ten en cuenta',
  Preparing: 'Preparando',
  'Preparing audio…': 'Preparando el audio…',
  'Preparing the audio…': 'Preparando el audio…',
  'Preparing…': 'Preparando…',
  'Press a question to read its answer.': 'Pulsa una pregunta para leer su respuesta.',
  'Previous match': 'Coincidencia anterior',
  'Print to PDF': 'Imprimir en PDF',
  Privacy: 'Privacidad',
  'Privacy and cookie settings': 'Ajustes de privacidad y cookies',
  'Privacy policy': 'Política de privacidad',
  'Privacy requests': 'Solicitudes de privacidad',
  Private: 'Privado',
  Progress: 'Progreso',
  Quality: 'Calidad',
  'Questions about these terms:': 'Preguntas sobre estos términos:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'Las preguntas, los informes de errores y las ideas siempre son bienvenidos. Escribe a {email} o consulta la página de [Contacto](/contact) para saber qué incluir.',
  Queued: 'En cola',
  'Quick results. Good for clear speech.': 'Resultados rápidos. Bueno para voz clara.',
  Quickest: 'El más rápido',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen usa marcas de tiempo aproximadas por fragmento. Los tiempos por palabra y la confianza no están disponibles.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen usa marcas de tiempo por fragmento y no ofrece confianza por palabra. Compara una muestra corta antes de elegirlo.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (experimental)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR necesita un navegador de escritorio con WebGPU (Chrome o Edge) y compatibilidad con sombreadores de 16 bits (shader-f16) en el controlador gráfico.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR necesita un navegador de escritorio con WebGPU (Chrome o Edge) y 8 GB de memoria.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR necesita un navegador de escritorio con WebGPU (Chrome o Edge).',
  'Re-transcribe': 'Volver a transcribir',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'Lee la transcripción con marcas de tiempo, mira de qué palabras no estaba seguro el modelo y corrígelas en el sitio.',
  'Read, edit, download': 'Lee, edita, descarga',
  Ready: 'Listo',
  'Ready to print or share': 'Listo para imprimir o compartir',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    '¿Listo para probarlo? [Ver todas las herramientas gratuitas](/tools) o [transcribe un archivo ahora](/).',
  'Recognition engine': 'Motor de reconocimiento',
  Recommended: 'Recomendado',
  'Record from microphone': 'Grabar desde el micrófono',
  'Record straight from your microphone and turn it into text.':
    'Graba directamente desde tu micrófono y conviértelo en texto.',
  'Record with your microphone': 'Grabar con el micrófono',
  'Recording {stamp}': 'Grabación {stamp}',
  'Recording is not supported by this browser.': 'Este navegador no admite la grabación.',
  'Related reading': 'Lecturas relacionadas',
  Remove: 'Quitar',
  'Remove {name}': 'Quitar {name}',
  'Removes it for good': 'Se quita para siempre',
  Rename: 'Cambiar nombre',
  Renamed: 'Nombre cambiado',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    '¿Reemplazar "{query}" por "{replacement}" en {n} líneas?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    '¿Reemplazar "{query}" por "{replacement}" en 1 línea?',
  'Replace in {n} lines': 'Reemplazar en {n} líneas',
  'Replace in 1 line': 'Reemplazar en 1 línea',
  'Replace with': 'Reemplazar por',
  'Replace with…': 'Reemplazar por…',
  'Replace…': 'Reemplazar…',
  Replaced: 'Reemplazado',
  'Reporting a problem': 'Informar de un problema',
  'Retrying…': 'Reintentando…',
  'Review language and quality': 'Revisa el idioma y la calidad',
  'Review this transcript': 'Revisa esta transcripción',
  Save: 'Guardar',
  Saved: 'Guardado',
  'Saving…': 'Guardando…',
  'Search depth: {n}': 'Profundidad de búsqueda: {n}',
  'Search the text': 'Buscar en el texto',
  'Search the transcript': 'Buscar en la transcripción',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'Consulta también los [Términos de uso](/terms), [Cómo funciona](/how-it-works) y las [Preguntas frecuentes](/faq).',
  'Server busy': 'Servidor ocupado',
  'Session only — nothing is saved.': 'Solo la sesión — no se guarda nada.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'Solo la sesión — no se guarda nada. Al cerrar la aplicación se borran todas las transcripciones. Exporta lo que necesites.',
  'Session time left: about {n} min': 'Tiempo de sesión restante: unos {n} min',
  'Short (32 letters)': 'Corta (32 letras)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'Respuestas breves y prácticas sobre cómo convertir voz en texto y subtítulos: qué formato de subtítulos elegir, cómo añadir subtítulos a un video, cómo conseguir una transcripción más precisa y cómo puede ejecutarse la transcripción en tu propio navegador sin subir tu archivo.',
  'Show all {count} languages': 'Mostrar los {count} idiomas',
  'Six ways to download': 'Seis formas de descargar',
  'Skip to main content': 'Saltar al contenido principal',
  Slower: 'Más lento',
  'slower than real time on the measured laptop':
    'más lento que el tiempo real en la computadora portátil medida',
  Slowest: 'El más lento',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'Algunas funciones descargan componentes de código abierto en tu navegador cuando las usas. Se ejecutan en tu dispositivo como el resto del motor. Sus licencias nos piden mostrar estos avisos:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'Algunos pasajes necesitan una revisión auditiva por texto repetido o por un límite de la voz incierto.',
  'Something went wrong': 'Algo salió mal',
  'Something went wrong in this browser. Please try again.':
    'Algo salió mal en este navegador. Inténtalo de nuevo.',
  'Something went wrong while reading this file.': 'Algo salió mal al leer este archivo.',
  'Source code': 'Código fuente',
  Speed: 'Velocidad',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'Las velocidades en teléfonos y tabletas son estimadas, no medidas; Tiny y Base son los tamaños seguros.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT y VTT para subtítulos, TXT y Markdown para leer, JSON para programas o un PDF para imprimir.',
  Standard: 'Estándar',
  'Standard (42 letters)': 'Estándar (42 letras)',
  Start: 'Empezar',
  'Start a new transcription': 'Empezar una transcripción nueva',
  'Start again': 'Empezar de nuevo',
  'Started again': 'Reiniciada',
  'Starting…': 'Iniciando…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    '¿Sigues con dudas? Lee las [preguntas frecuentes](/faq), mira [cómo funciona](/how-it-works) o [ponte en contacto con nosotros](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    '¿Sigues atascado? [Lee Cómo funciona](/how-it-works)',
  'Stop recording · {time}': 'Detener la grabación · {time}',
  'Stop this transcription? The text found so far is kept.':
    '¿Detener esta transcripción? Se conserva el texto encontrado hasta ahora.',
  'Stopping the transcription worker. The text found so far is kept.':
    'Deteniendo el proceso de transcripción. Se conserva el texto encontrado hasta ahora.',
  'Stored on this device only, never uploaded.':
    'Guardado solo en este dispositivo, nunca se sube.',
  'Style unchanged': 'Estilo sin cambios',
  'Style updated': 'Estilo actualizado',
  'Style updated using the saved recognition. Edited lines are kept.':
    'Estilo actualizado con el reconocimiento guardado. Se conservan las líneas editadas.',
  'Subtitle files': 'Archivos de subtítulos',
  'Subtitle line length': 'Longitud de línea de los subtítulos',
  'Subtitles (.srt)': 'Subtítulos (.srt)',
  'Switch to dark theme': 'Cambiar al tema oscuro',
  'Switch to light theme': 'Cambiar al tema claro',
  Terms: 'Términos',
  'Terms of use': 'Términos de uso',
  'Text with times (.txt)': 'Texto con tiempos (.txt)',
  'That file is already in the list.': 'Ese archivo ya está en la lista.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'Eso no es un archivo de video ni de audio. Elige un MP4, MOV, MP3 u otro archivo de video o de audio.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'Eso no es un archivo de video ni de audio. Elige un archivo de video o de audio.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'Eso no es un archivo de audio. Elige un MP3, WAV, M4A u otro archivo de audio.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    'La [Política de privacidad](/privacy) explica qué se trata y por qué. Para hacer una pregunta sobre tus datos o ejercer tus derechos, escribe a la misma dirección.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'El modelo {label} no puede ejecutarse en este dispositivo: {reason}. Elige otro.',
  'the exact error message, or a screenshot of it.':
    'el mensaje de error exacto o una captura de pantalla.',
  'The file is larger than the server accepts.':
    'El archivo es más grande de lo que acepta el servidor.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'La primera vez que usas un nivel de calidad, tu navegador descarga su modelo de voz una vez y lo conserva para la próxima, así que los archivos siguientes empiezan antes.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'La primera vez que usas un nivel de calidad, tu navegador descarga el modelo de voz de Hugging Face y los archivos de programa del motor de jsDelivr, y los conserva para la próxima vez; con ellos no se envía nada de tu archivo. Cuando termina una transcripción, tu navegador suma uno al contador anónimo del encabezado de la página, y nada más.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'El controlador gráfico no tiene sombreadores de 16 bits: las descargas son mayores y el uso de memoria más alto.',
  'The line was removed.': 'Se eliminó la línea.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'Las herramientas principales: convierte cualquier archivo de video o de audio en una transcripción con marcas de tiempo.',
  'The page you are looking for does not exist or has moved.':
    'La página que buscas no existe o se ha movido.',
  'The recording failed. Please try again.': 'La grabación falló. Inténtalo de nuevo.',
  'The server does not have enough free disk space for this file.':
    'El servidor no tiene suficiente espacio libre en disco para este archivo.',
  'The server is busy': 'El servidor está ocupado',
  'The server is busy right now.': 'El servidor está ocupado ahora mismo.',
  'The service is busy right now. Please wait a moment and try again.':
    'El servicio está ocupado ahora mismo. Espera un momento e inténtalo de nuevo.',
  'The service is full right now. Please try again in a little while.':
    'El servicio está lleno ahora mismo. Inténtalo de nuevo en un rato.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'El reconocimiento de voz se ejecuta dentro de tu propio navegador, con modelos abiertos de reconocimiento de voz como OpenAI Whisper. Tu navegador descarga el modelo una vez y lo conserva, y luego hace todo el trabajo en tu dispositivo. Tu video o audio nunca se sube a nuestros servidores, y por eso tampoco hay límite de tamaño de archivo ni cola con los archivos de otras personas. La página [Cómo funciona](/how-it-works) explica cada paso.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'No se pudo identificar con seguridad el idioma hablado. Elige el idioma que oyes e inténtalo de nuevo.',
  'The text found before it was stopped is shown below.':
    'El texto encontrado antes de detenerla se muestra abajo.',
  'The text found so far is kept.': 'Se conserva el texto encontrado hasta ahora.',
  'The text is ready to paste.': 'El texto está listo para pegar.',
  'The transcript finished before it could be cancelled.':
    'La transcripción terminó antes de poder cancelarse.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'La transcripción se ejecuta en tu propio dispositivo con modelos abiertos de reconocimiento de voz como OpenAI Whisper. Tu navegador descarga un modelo una vez y lo conserva, así que el siguiente archivo empieza más rápido, y tu video o audio nunca se sube a ningún sitio.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'el tipo y la duración del archivo, por ejemplo "MP4, 25 minutos";',
  'There is no size or length limit set here.':
    'Aquí no hay ningún límite de tamaño ni de duración.',
  'These details make a problem much quicker to find and fix:':
    'Estos detalles hacen que un problema sea mucho más rápido de encontrar y arreglar:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'Estos términos se rigen por las leyes de la India. Los tribunales de Bengaluru, Karnataka, India tienen jurisdicción exclusiva sobre cualquier disputa que surja de ellos. Esto no te quita ninguna protección que tengas bajo las leyes imperativas de consumo del país donde vives.',
  'They are downloaded again the next time you transcribe.':
    'Se vuelven a descargar la próxima vez que transcribas.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Los proveedores externos, incluido Google, usan cookies para mostrar anuncios basados en tus visitas anteriores a este sitio web o a otros sitios web. El uso de cookies publicitarias por parte de Google le permite a él y a sus socios mostrarte anuncios basados en tu visita a este sitio y/o a otros sitios de Internet.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'Este cuadro acepta archivos de audio como MP3, WAV o M4A, pero ese es un video.',
  'This browser cannot record. Please choose a file instead.':
    'Este navegador no puede grabar. Elige un archivo en su lugar.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'Este navegador no informa de la memoria; se supone que hay {gb} GB. Elige un modelo más pequeño si la página se pone lenta.',
  'This cannot be undone. Export anything you want to keep first.':
    'Esto no se puede deshacer. Antes, exporta lo que quieras conservar.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    'Esta copia de {brand} se ejecuta en tu propia computadora. Tus archivos se procesan en esta máquina y nada sale de ella. No se guarda nada de forma permanente: las transcripciones existen solo durante esta sesión, así que exporta lo que necesites. La [Política de privacidad](/privacy) describe el sitio web alojado.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'Esta copia se ejecuta en tu propia computadora. Tus archivos se procesan en esta máquina y nada sale de ella.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Este dispositivo tiene poca memoria para un archivo tan largo. Se procesa en trozos pequeños, lo que es más lento; un corte más corto o un modelo más pequeño es más seguro.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'Este archivo necesita un conversor de 9 MB que se ejecuta en tu navegador. ¿Cargarlo?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'Esta es una traducción de cortesía. Si difiere de la versión en inglés, prevalece la versión en inglés.',
  'This local copy does not count transcriptions': 'Esta copia local no cuenta las transcripciones',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'Esta transcripción tiene poca confianza del modelo. Escucha la grabación y comprueba el idioma hablado antes de usar el texto.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'Esto tardará {wait} en este dispositivo (estimado). Mantén la pestaña abierta hasta que termine.',
  Timestamps: 'Marcas de tiempo',
  'Tips for the best results': 'Consejos para obtener los mejores resultados',
  'Tips for the best transcript': 'Consejos para la mejor transcripción',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'Para cambiar tus opciones de anuncios, usa la [Configuración de anuncios de Google](https://adssettings.google.com) o los ajustes de cookies de tu navegador.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'Para cambiar tus opciones de anuncios, usa **Ajustes de privacidad y cookies** al final de una página que muestre anuncios, la [Configuración de anuncios de Google](https://adssettings.google.com) o los ajustes de cookies de tu navegador.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'Para darte la transcripción que has pedido en tu propio dispositivo, para entregar el sitio web de forma segura y para mantener el servicio gratuito mediante publicidad. Cuando se aplica una ley de protección de datos como el RGPD, nuestras bases jurídicas son la prestación del servicio que has solicitado (art. 6.1.b), nuestro interés legítimo en la seguridad, la prevención de abusos y el total anónimo (art. 6.1.f) y, para las cookies publicitarias cuando la ley lo exige, tu consentimiento (art. 6.1.a), que pide el mensaje de consentimiento de Google.',
  'To keep it fast for everyone, each file has a size and length limit.':
    'Para que sea rápido para todos, cada archivo tiene un límite de tamaño y de duración.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'En la medida en que la ley lo permita, no somos responsables de pérdidas indirectas o consecuentes, de la pérdida de datos, beneficios o negocio, ni de ninguna pérdida derivada de tu uso del servicio o de la imposibilidad de usarlo, ni de los errores de una transcripción. Nada en estos términos limita la responsabilidad que no pueda limitarse por ley.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'Para transcribir en tu dispositivo, tu navegador descarga los archivos del modelo de voz de Hugging Face (huggingface.co) y los archivos de programa del motor de voz de jsDelivr (cdn.jsdelivr.net), y los guarda en su caché (Cache Storage) para la próxima vez hasta que los borres. Esos proveedores reciben los datos habituales de la solicitud (tu dirección IP, tu navegador y qué archivo se solicitó), nunca tu contenido multimedia ni tu transcripción.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'Para funcionar en tu dispositivo, tu navegador descarga modelos de voz de Hugging Face y archivos de programa de jsDelivr; se ofrecen con sus propias licencias y condiciones. Los anuncios los proporciona Google AdSense; un anuncio lleva a un sitio web de terceros que no controlamos y del que no somos responsables.',
  Transcribe: 'Transcribir',
  'Transcribe (same language)': 'Transcribir (mismo idioma)',
  'Transcribe {n} files': 'Transcribir {n} archivos',
  'Transcribe a file': 'Transcribir un archivo',
  'Transcribe or translate speech in the language you need.':
    'Transcribe o traduce voz en el idioma que necesites.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'Transcribe videos, archivos de audio y grabaciones de voz en más de 50 idiomas, o deja que el idioma se detecte por ti.',
  'Transcribing {n}%': 'Transcribiendo {n}%',
  'Transcribing takes {time} on this device.': 'Transcribir tarda {time} en este dispositivo.',
  'Transcribing…': 'Transcribiendo…',
  Transcript: 'Transcripción',
  'Transcript name': 'Nombre de la transcripción',
  'Transcript not found': 'Transcripción no encontrada',
  'Transcript ready': 'Transcripción lista',
  'Transcript style': 'Estilo de la transcripción',
  'Transcription failed': 'Falló la transcripción',
  'Transcription has started. The text appears below as it is recognised.':
    'La transcripción ha empezado. El texto aparece abajo a medida que se reconoce.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'La transcripción ha empezado. Tus otros archivos están en Transcripciones, en la parte superior de la página.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'La transcripción se ejecuta en tu dispositivo y usa su procesador, chip gráfico, memoria y batería. No ponemos ningún límite de tamaño ni de duración de archivo, pero la velocidad y el tamaño de archivo que tu navegador puede manejar dependen de tu dispositivo: un archivo largo en un teléfono o una computadora más lentos puede tardar mucho o quedarse sin memoria. Tus transcripciones y archivos se guardan en este navegador y se borran automáticamente tras {idle} de inactividad. Consulta la [Política de privacidad](/privacy).',
  'Transcription settings': 'Ajustes de transcripción',
  Transcripts: 'Transcripciones',
  'Transcripts {n}': 'Transcripciones {n}',
  'Transcripts are only kept for the browser session that created them.':
    'Las transcripciones solo se conservan durante la sesión del navegador que las creó.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'Las transcripciones se producen automáticamente y contendrán errores, sobre todo con audio con ruido, acentos marcados, voces que se solapan, música y nombres o términos técnicos. Comprueba siempre una transcripción antes de fiarte de ella, en particular para usos legales, médicos, financieros o de publicación. El servicio se ofrece "tal cual" y "según disponibilidad", sin garantía alguna, expresa o implícita, incluida la relativa a la precisión, la integridad o la idoneidad para un fin determinado.',
  'Translate to English': 'Traducir al inglés',
  'Try again': 'Inténtalo de nuevo',
  'Try another quality or language': 'Prueba otra calidad u otro idioma',
  'try to spread malware or anything meant to damage the service.':
    'intentar difundir software malicioso ni nada destinado a dañar el servicio.',
  'Trying again in a moment…': 'Reintentando en un momento…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'Reintentando. Esta página se carga sola en cuanto el servidor vuelva.',
  'under a minute': 'menos de un minuto',
  'Underline unsure words': 'Subrayar palabras dudosas',
  Unlimited: 'Sin límites',
  'Unsure: worth listening to again': 'Dudoso: conviene volver a escucharlo',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'A las ráfagas de cargas inusualmente intensas se les puede pedir que esperen un poco.',
  'Up to {minutes} per file.': 'Hasta {minutes} por archivo.',
  'Up to {size} and {minutes} minutes per file.': 'Hasta {size} y {minutes} minutos por archivo.',
  'Up to {size} and {minutes} per file.': 'Hasta {size} y {minutes} por archivo.',
  'Up to {size} per file.': 'Hasta {size} por archivo.',
  'Updated {date}': 'Actualizado el {date}',
  'Upload complete': 'Carga completada',
  'Upload failed': 'Falló la carga',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'Falló la carga (error del servidor {status}). Consulta el terminal donde se ejecuta el servidor para ver los detalles.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'Falló la carga (error del servidor {status}). Inténtalo de nuevo en un momento.',
  Uploading: 'Subiendo',
  'Uploading…': 'Subiendo…',
  'use a computer for this size': 'usa una computadora para este tamaño',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'usar scripts, bots u otros medios automatizados contra el sitio web o su contador, ni enviar recuentos inventados, sin nuestro permiso por escrito;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'usar el servicio con contenido ilegal o que infrinja los derechos de otra persona;',
  'use the service to harass, harm or deceive others;':
    'usar el servicio para acosar, dañar o engañar a otras personas;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'Suele ser muy preciso con voz clara. Las líneas de las que no está seguro están marcadas, para que las revises primero.',
  'Video and audio to text': 'Video y audio a texto',
  'Video or audio, several at once is fine.': 'Video o audio; puedes añadir varios a la vez.',
  'Video to text, accurately.': 'Video a texto, con precisión.',
  'Video to text: transcribe a video or audio file':
    'Video a texto: transcribe un archivo de video o de audio',
  'video transcribed': 'video transcrito',
  'videos transcribed': 'videos transcritos',
  'Vocabulary hint': 'Pista de vocabulario',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'Notas de voz, reuniones, clases, pódcast y entrevistas.',
  'Waiting for microphone permission…': 'Esperando el permiso del micrófono…',
  'Waiting for the first words…': 'Esperando las primeras palabras…',
  'Waiting in line…': 'Esperando en la cola…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'Mira cómo aparece el texto en directo, corrige los errores y descárgalo como SRT, VTT, TXT, Markdown, JSON o PDF.',
  'We do not ask for your name, e-mail address or any other account details.':
    'No te pedimos tu nombre, tu correo electrónico ni ningún otro dato de cuenta.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'No prometemos que el servicio esté siempre disponible, sin interrupciones o sin errores. El sitio web o las descargas que necesita (los modelos de voz de Hugging Face y los archivos de programa de jsDelivr) pueden no estar disponibles por mantenimiento o por motivos ajenos a nuestro control, y algunos navegadores o dispositivos no pueden ejecutar todos los modelos. Como tus transcripciones se guardan solo en este navegador y se borran tras un periodo de inactividad, exporta siempre lo que necesites.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'No vendemos tus datos. No guardamos ninguno de tus archivos ni transcripciones, así que no tenemos nada que compartir: el reconocimiento se ejecuta en tu dispositivo, no en un servicio externo de transcripción o de IA. Google (publicidad), Cloudflare (alojamiento y contador), Hugging Face y jsDelivr (las descargas) reciben solo lo descrito arriba. Podemos revelar información si la ley lo exige.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'No conservamos nada tuyo de nuestra parte: aparte del único total acumulado, no guardamos nada sobre tu uso.',
  'We may block access if these rules are broken.':
    'Podemos bloquear el acceso si se incumplen estas reglas.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'Podemos actualizar estos términos. La nueva versión aparece en esta página con una nueva fecha de "Última actualización" y se aplica desde ese momento.',
  'We never send your file, your transcript or any personal information to Google.':
    'Nunca enviamos tu archivo, tu transcripción ni ninguna información personal a Google.',
  'Web subtitles (.vtt)': 'Subtítulos web (.vtt)',
  'What people use it for': 'Para qué lo usa la gente',
  'What you can do with it': 'Qué puedes hacer con él',
  'What you get': 'Qué obtienes',
  'what you were doing, and what happened instead of what you expected;':
    'qué estabas haciendo y qué ocurrió en lugar de lo que esperabas;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'Dónde se procesan tus archivos depende de cómo se ejecute {brand}, y el servidor no ha respondido ahora. Consulta la [Política de privacidad](/privacy).',
  'Where your files are processed depends on how {brand} is run.':
    'Dónde se procesan tus archivos depende de cómo se ejecute {brand}.',
  'Which files can I use, and what are the limits?':
    '¿Qué archivos puedo usar y cuáles son los límites?',
  'Which languages are supported?': '¿Qué idiomas se admiten?',
  'Who builds it': 'Quién lo crea',
  'Who runs this website': 'Quién gestiona este sitio web',
  'Why it exists': 'Por qué existe',
  'Working…': 'Trabajando…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'Sí. Es gratis y nunca hay cuenta ni inicio de sesión. No hay cuota diaria ni mensual ni muro de pago; los anuncios mantienen el sitio web gratuito.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'Sí. Es gratis y nunca hay cuenta ni inicio de sesión. No hay cuota diaria ni mensual ni muro de pago.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'Sí. Es gratis, no hay nada a lo que registrarse ni inicio de sesión. Esta copia se ejecuta en tu propia computadora, así que no hay cuota ni muro de pago; la velocidad depende de tu computadora.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'Sí. Usa el lápiz junto a una línea para cambiar su texto o borrar la línea, o busca y reemplaza en toda la transcripción. Tus ediciones se incluyen en cada exportación.',
  'You agree not to:': 'Te comprometes a no:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'Tú tienes el control: borra tus transcripciones, tus archivos y, si quieres, los modelos de voz descargados en cualquier momento con **Borrar mis datos ahora**. Borra solo los datos de este navegador; no puede borrar las cookies de Google.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'Puedes cambiarlo en cualquier momento con **Ajustes de privacidad y cookies**, al final de cualquier página que muestre anuncios (por ejemplo, la página de inicio).',
  'You can now read, fix and download it.': 'Ya puedes leerla, corregirla y descargarla.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'Puedes dejar de usar el servicio en cualquier momento y borrar los datos de este navegador con **Borrar mis datos ahora**. Podemos suspender o terminar tu acceso en cualquier momento, en particular si incumples estos términos.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'Conservas todos los derechos sobre los archivos que añades y las transcripciones hechas a partir de ellos. Se procesan en tu dispositivo y nosotros nunca los recibimos. Eres responsable de lo que transcribes: usa solo contenido que sea tuyo o que tengas derecho a procesar, incluido cualquier permiso necesario de las personas que hablan en él.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'Puedes optar por no recibir publicidad personalizada visitando la [Configuración de anuncios de Google](https://adssettings.google.com), o excluirte del uso de cookies por parte de algunos proveedores externos para publicidad personalizada en [www.aboutads.info](https://www.aboutads.info). Consulta [cómo usa Google la información de los sitios que utilizan sus servicios](https://policies.google.com/technologies/partner-sites).',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'tu navegador y su versión, y tu dispositivo (computadora o teléfono, y su sistema operativo);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'Tu navegador bloqueó la copia aquí. Usa Exportar para guardar el texto.',
  'Your change is saved.': 'Tu cambio se ha guardado.',
  'Your change is still in its box: press Save to try again.':
    'Tu cambio sigue en su cuadro: pulsa Guardar para intentarlo de nuevo.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'Tu archivo se envía al servidor por una conexión cifrada, se transcribe con modelos abiertos de reconocimiento de voz como OpenAI Whisper y se borra automáticamente después. La página [Cómo funciona](/how-it-works) explica cada paso.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'Tu archivo se transcribe en tu navegador, en tu propio dispositivo, así que no ponemos ningún límite de tamaño ni de duración. Los archivos muy grandes o largos también funcionan: tardan más y necesitan suficiente memoria libre, y la página te avisa cuando tu dispositivo puede ir lento.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'Tu archivo se transcribe con modelos abiertos de reconocimiento de voz como OpenAI Whisper y se borra automáticamente después.',
  'Your file never leaves your device.': 'Tu archivo nunca sale de tu dispositivo.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'Tu archivo nunca sale de tu dispositivo. [Privacidad](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'Tu archivo nunca sale de tu dispositivo. Se transcribe en tu navegador, en este dispositivo, y nunca se sube a nosotros ni a nadie más. Las transcripciones, tus ediciones y el archivo se guardan solo en el almacenamiento de este navegador y se borran automáticamente tras {idle} de inactividad, o al instante cuando pulsas **Borrar mis datos ahora** en el menú Transcripciones. No hay cuenta. Exporta lo que necesites antes de irte.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'Tu archivo nunca sale de tu dispositivo. Se transcribe directamente en tu navegador, sin cuenta, y tus transcripciones se quedan en este navegador.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'Tu archivo se queda en este dispositivo. Mantén esta pestaña abierta mientras se transcribe.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Tus archivos y transcripciones se conservan solo durante esta sesión y se borran automáticamente tras {idle} de inactividad, o cuando pulsas "Borrar mis datos ahora". Sin cuenta, sin seguimiento, una cookie de sesión imprescindible. Exporta lo que necesites antes de irte.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Tus archivos y transcripciones se conservan solo durante esta sesión y se borran automáticamente cuando termina, o cuando pulsas "Borrar mis datos ahora". Sin cuenta, sin seguimiento, una cookie de sesión imprescindible. Exporta lo que necesites antes de irte.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'Tus archivos se borran automáticamente. [Privacidad](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'Tus archivos se procesan en tu navegador y se quedan en tu dispositivo. El sitio web, las descargas y el contador usan conexiones cifradas (HTTPS). Cualquiera que pueda usar este perfil del navegador puede ver las transcripciones guardadas en él hasta que se borren, así que pulsa **Borrar mis datos ahora** en una computadora compartida.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Tus archivos se suben a nuestro servidor para procesarlos allí. Se conservan solo durante tu sesión y se borran automáticamente cuando termina, tras {idle} de inactividad, o al instante cuando pulsas **Borrar mis datos ahora** en el menú Transcripciones. No hay cuenta ni seguimiento, y la única cookie es una cookie de sesión imprescindible (sin cookies de analítica ni de publicidad).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Tus archivos se suben a nuestro servidor para procesarlos allí. Se conservan solo durante tu sesión y se borran automáticamente cuando termina, o al instante cuando pulsas **Borrar mis datos ahora** en el menú Transcripciones. No hay cuenta ni seguimiento, y la única cookie es una cookie de sesión imprescindible (sin cookies de analítica ni de publicidad).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'Tus archivos nunca salen de este dispositivo. Las transcripciones se guardan solo en este navegador y se borran automáticamente tras {idle} de inactividad, o cuando pulsas "Borrar mis datos ahora". Exporta lo que necesites antes de irte.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'Tus archivos nunca salen de este dispositivo. Las transcripciones se guardan solo en este navegador y se borran automáticamente cuando termina la sesión, o cuando pulsas "Borrar mis datos ahora". Exporta lo que necesites antes de irte.',
  'Your session ends in {mins} min. Export what you need.':
    'Tu sesión termina en {mins} min. Exporta lo que necesites.',
  'Your session has ended': 'Tu sesión ha terminado',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'Tu sesión ha terminado y sus datos se borraron. Puedes empezar una transcripción nueva.',
  'Your transcript is ready below.': 'Tu transcripción está lista abajo.',
  'Your transcripts': 'Tus transcripciones',
  'Your transcripts and files were removed from the server.':
    'Tus transcripciones y archivos se eliminaron del servidor.',
  'Your transcripts and files were removed from this device.':
    'Tus transcripciones y archivos se eliminaron de este dispositivo.',
  'title:/': 'Video y audio a texto gratis, sin registro',
  'description:/':
    'Convierte video y audio a texto gratis, sin registro y sin límites diarios. Más de 50 idiomas, marcas de tiempo y descarga en SRT, VTT, TXT o PDF.',
  'title:/about': 'Acerca de TranscribeVid',
  'description:/about':
    'Quién crea TranscribeVid y por qué: una herramienta gratuita de video y audio a texto sin registro y con una interfaz limpia, financiada con anuncios.',
  'title:/contact': 'Contacto',
  'description:/contact':
    'Cómo contactar con TranscribeVid: correo para preguntas, informes de errores, ideas de funciones y solicitudes de privacidad, y quién gestiona el sitio.',
  'title:/faq': 'Preguntas frecuentes',
  'description:/faq':
    'Respuestas a las preguntas habituales sobre TranscribeVid: precisión, idiomas, archivos admitidos y límites, velocidad, privacidad y edición.',
  'title:/how-it-works': 'Cómo funciona',
  'description:/how-it-works':
    'Cómo TranscribeVid convierte video y audio en texto preciso con marcas de tiempo en tres pasos, qué obtienes y consejos para los mejores resultados.',
  'title:/privacy': 'Política de privacidad',
  'description:/privacy':
    'Qué trata TranscribeVid al transcribir un archivo, dónde, por qué y cuánto tiempo, además de cookies, anuncios, almacenamiento del navegador y tus derechos.',
  'title:/terms': 'Términos de uso',
  'description:/terms':
    'Las reglas para usar TranscribeVid: servicio gratuito, tu contenido, uso aceptable, límites de archivo, sin garantía de precisión y responsabilidad.',
  'title:/tools': 'Todas las herramientas gratuitas',
  'description:/tools':
    'Todas las herramientas gratuitas de video y audio a texto: por tipo de archivo, por uso, subtítulos e idiomas. Sin registro y en más de 50 idiomas.',
  'title:/guides': 'Guías de transcripción y subtítulos',
  'description:/guides':
    'Guías prácticas sobre transcripciones y subtítulos: SRT o VTT, cómo añadir subtítulos a un video, cómo lograr precisión y transcribir en privado.',
  'title:/video-to-text': 'Video a texto gratis, sin registro',
  'description:/video-to-text':
    'Convierte video a texto gratis. Transcripción precisa con marcas de tiempo en más de 50 idiomas. Sin registro ni límite diario. Descarga SRT, VTT, TXT o PDF.',
  'label:/video-to-text': 'Video a texto',
  'title:/audio-to-text': 'Audio a texto gratis y sin límites',
  'description:/audio-to-text':
    'Convierte podcasts, entrevistas y clases en texto. Audio a texto gratis con marcas de tiempo, más de 50 idiomas, sin registro. Descarga TXT, SRT, VTT o PDF.',
  'label:/audio-to-text': 'Audio a texto',
  'title:/mp4-to-text': 'MP4 a texto: transcribe videos MP4 gratis',
  'description:/mp4-to-text':
    'Convierte un video MP4 a texto con marcas de tiempo. Gratis, sin registro ni límite diario, más de 50 idiomas. Descarga TXT, SRT, VTT, JSON o PDF.',
  'label:/mp4-to-text': 'MP4 a texto',
  'title:/mp3-to-text': 'MP3 a texto: convertidor y transcripción',
  'description:/mp3-to-text':
    'Transcribe un MP3 a texto en línea, gratis. Sin registro, más de 50 idiomas y una marca de tiempo por línea. Edita y descarga TXT, SRT, VTT o PDF.',
  'label:/mp3-to-text': 'MP3 a texto',
  'title:/srt-subtitle-generator': 'Generador de subtítulos SRT gratis',
  'description:/srt-subtitle-generator':
    'Genera un archivo de subtítulos SRT desde cualquier video o audio, gratis. Sincronizado con la voz, más de 50 idiomas, sin registro. Descarga SRT o VTT.',
  'label:/srt-subtitle-generator': 'Generador de subtítulos SRT',
  'title:/voice-recording-to-text': 'Grabación de voz a texto gratis',
  'description:/voice-recording-to-text':
    'Graba tu voz en el navegador o añade una nota de voz y obtenla como texto. Gratis, sin registro, más de 50 idiomas. Descarga TXT, PDF, SRT o Markdown.',
  'label:/voice-recording-to-text': 'Grabación de voz a texto',
  'title:/wav-to-text': 'WAV a texto: transcripción en línea gratis',
  'description:/wav-to-text':
    'Convierte un archivo WAV a texto gratis. Admite grabaciones largas de grabadoras y llamadas, más de 50 idiomas y marcas de tiempo. Descarga TXT, SRT o PDF.',
  'label:/wav-to-text': 'WAV a texto',
  'title:/m4a-to-text': 'M4A a texto: transcribe notas de voz gratis',
  'description:/m4a-to-text':
    'Convierte una nota de voz o grabación M4A en texto, gratis. Funciona con Notas de voz del iPhone, sin registro, más de 50 idiomas, con marcas de tiempo.',
  'label:/m4a-to-text': 'M4A a texto',
  'title:/webm-to-text': 'WebM a texto: transcripción gratis',
  'description:/webm-to-text':
    'Convierte un video o audio WebM a texto, gratis. Funciona con grabaciones de pantalla y del navegador, más de 50 idiomas. Descarga TXT, SRT, VTT o PDF.',
  'label:/webm-to-text': 'WebM a texto',
  'title:/mov-to-text': 'MOV a texto: transcribe videos de iPhone',
  'description:/mov-to-text':
    'Transcribe un video MOV de tu iPhone o de QuickTime, gratis. Sin registro, más de 50 idiomas y marcas de tiempo. Descarga TXT, SRT, VTT o PDF.',
  'label:/mov-to-text': 'MOV a texto',
  'title:/whatsapp-voice-message-to-text': 'Nota de voz de WhatsApp a texto, gratis',
  'description:/whatsapp-voice-message-to-text':
    'Convierte una nota de voz de WhatsApp en texto, gratis. Guarda la nota, suéltala aquí y léela en más de 50 idiomas, incluido el hindi. Sin registro.',
  'label:/whatsapp-voice-message-to-text': 'Nota de voz de WhatsApp a texto',
  'title:/meeting-recording-to-text': 'Grabación de Zoom, Teams y Meet a texto',
  'description:/meeting-recording-to-text':
    'Convierte una grabación de Zoom, Teams o Google Meet en una transcripción con marcas de tiempo, gratis. Sin registro, más de 50 idiomas. TXT, SRT, VTT o PDF.',
  'label:/meeting-recording-to-text': 'Grabación de reunión a texto',
  'title:/lecture-to-text': 'Clase a texto: transcribe tus clases gratis',
  'description:/lecture-to-text':
    'Convierte una clase grabada en notas de texto para buscar y estudiar. Gratis, sin registro, más de 50 idiomas y marcas de tiempo. TXT, Markdown, SRT o PDF.',
  'label:/lecture-to-text': 'Clase a texto',
  'title:/podcast-transcript-generator': 'Generador de transcripciones de podcast',
  'description:/podcast-transcript-generator':
    'Genera la transcripción de un podcast desde un MP3 o WAV, gratis. Marcas de tiempo, más de 50 idiomas, sin registro. Descarga TXT, Markdown, SRT, VTT o PDF.',
  'label:/podcast-transcript-generator': 'Generador de transcripciones de podcast',
  'title:/interview-transcription': 'Transcribir entrevistas: privado y gratis',
  'description:/interview-transcription':
    'Transcribe entrevistas gratis y sin cuenta. Texto con marcas de tiempo en más de 50 idiomas, para investigación, periodismo y selección. TXT o PDF.',
  'label:/interview-transcription': 'Transcripción de entrevistas',
  'title:/vtt-subtitle-generator': 'Generador de subtítulos VTT (WebVTT)',
  'description:/vtt-subtitle-generator':
    'Genera un archivo de subtítulos WebVTT (.vtt) desde cualquier video o audio, gratis. Sincronizado con la voz, más de 50 idiomas, sin registro. Descarga VTT.',
  'label:/vtt-subtitle-generator': 'Generador de subtítulos VTT',
  'title:/youtube-subtitle-generator': 'Subtítulos para YouTube: archivo SRT gratis',
  'description:/youtube-subtitle-generator':
    'Crea un archivo de subtítulos SRT para tu propio video de YouTube, gratis y sin iniciar sesión. Más de 50 idiomas. Súbelo en YouTube Studio.',
  'label:/youtube-subtitle-generator': 'Generador de subtítulos para YouTube',
  'title:/translate-audio-to-english': 'Traducir audio al inglés: texto gratis',
  'description:/translate-audio-to-english':
    'Convierte la voz de otro idioma en texto en inglés, gratis. Añade un video o audio y obtén texto o subtítulos en inglés con marcas de tiempo. Sin registro.',
  'label:/translate-audio-to-english': 'Traducir audio al inglés',
  'title:/guides/srt-vs-vtt': 'SRT o VTT: qué formato de subtítulos usar',
  'description:/guides/srt-vs-vtt':
    '¿SRT o VTT? Qué es cada formato de subtítulos, en qué se diferencian, dónde funciona cada uno y cómo obtener el archivo de tu video gratis.',
  'label:/guides/srt-vs-vtt': 'SRT o VTT',
  'title:/guides/how-to-add-subtitles-to-a-video': 'Cómo añadir subtítulos a un video (gratis)',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'Crea subtítulos en cuatro pasos: transcribe el video, corrige el texto, exporta SRT o VTT y añade el archivo a YouTube, VLC, un editor o tu web.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'Cómo añadir subtítulos a un video',
  'title:/guides/transcribe-video-without-uploading': 'Transcribir un video sin subirlo',
  'description:/guides/transcribe-video-without-uploading':
    'Cómo funciona la transcripción en el navegador, qué se queda en tu dispositivo, qué se descarga una vez y cómo comprobarlo en el panel de red.',
  'label:/guides/transcribe-video-without-uploading': 'Transcribir un video sin subirlo',
  'title:/guides/accurate-transcripts': 'Cómo conseguir una transcripción precisa',
  'description:/guides/accurate-transcripts':
    'Cómo mejorar la precisión de voz a texto: audio más limpio, idioma y modelo adecuados, pista de vocabulario y cómo revisar y corregir el resultado.',
  'label:/guides/accurate-transcripts': 'Cómo conseguir una transcripción más precisa',
  'title:/guides/what-is-whisper': '¿Qué es Whisper? Voz a texto explicado',
  'description:/guides/what-is-whisper':
    'Qué es OpenAI Whisper, con qué se entrenó, qué precisión tiene y dónde falla, y cómo se ejecuta dentro de tu navegador en TranscribeVid.',
  'label:/guides/what-is-whisper': '¿Qué es Whisper?',
  'an independent software developer': 'un desarrollador de software independiente',
  'Bengaluru, India': 'Bengaluru, India',
};
export default dict;
