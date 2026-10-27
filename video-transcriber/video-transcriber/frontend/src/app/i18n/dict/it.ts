/** Italian dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '"{name}" is {size}; the limit is {limit}.': '«{name}» pesa {size}; il limite è {limit}.',
  '"{name}" is empty.': '«{name}» è vuoto.',
  '"{name}" is ready. Press Transcribe to start.':
    '«{name}» è pronto. Premi Trascrivi per iniziare.',
  '“{title}” was deleted.': '«{title}» è stato eliminato.',
  '(optional)': '(facoltativo)',
  '{base} Word timing: {timing}.': '{base} Tempi per parola: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) è gestito da **{name}**, {address} («noi»). Siamo noi a decidere come e perché i tuoi dati vengono trattati, come descritto qui.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) è gestito da **{name}**, {address}. Scopri di più nella pagina [Chi siamo](/about).',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    "{brand} è un servizio per un pubblico generale e non è rivolto ai minori di 13 anni (o di 16 anni nell'UE, dove applicabile).",
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    "{brand} è creato e gestito da **{name}**, {role} con sede a {city}. L'ho creato per offrire a tutti la migliore esperienza di trascrizione possibile: fluida fin dal primo clic, senza account da creare e con un'interfaccia pulita che non ti intralcia.",
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} è pensato per un pubblico generale e non è rivolto ai minori di 13 anni.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand} è gratuito perché mostra annunci pubblicitari, forniti da Google AdSense. Gli annunci compaiono solo nelle pagine informative (home, Come funziona, FAQ e pagine degli strumenti). Nessun annuncio viene mostrato mentre un file viene trascritto né accanto alla tua trascrizione, e mai nelle pagine su privacy, termini o log.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    "{brand} è gratuito. L'[Informativa sulla privacy](/privacy) spiega cosa succede ai tuoi file.",
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    "{brand} è finanziato dagli annunci mostrati nelle sue pagine informative (Google AdSense). Poiché la trascrizione la fa il tuo dispositivo, non ci sono costi di server per ogni file, ed è questo che mantiene il servizio gratuito e senza limiti. L'[Informativa sulla privacy](/privacy) spiega cosa usano gli annunci e come scegliere le tue impostazioni.",
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} trasforma il parlato di un file video o audio in testo con timestamp, in tre semplici passaggi.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    "{brand} trasforma il parlato di video, file audio e registrazioni vocali in testo accurato e con timestamp. È gratuito, non c'è alcun limite al numero di file che trascrivi e non serve un account: scegli un file qui sopra, premi Trascrivi e leggi il risultato.",
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    "{brand} trasforma file video e audio in testo, direttamente nel tuo browser: il riconoscimento avviene sul tuo dispositivo e i tuoi file non vengono caricati da noi. È gratuito e non richiede un account. È finanziato dagli annunci nelle pagine informative (Google AdSense; vedi l'[Informativa sulla privacy](/privacy)). Possiamo modificare, limitare o interrompere le funzioni in qualsiasi momento.",
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} trasforma video e audio in testo accurato e con timestamp, gratis. Niente registrazione, niente accesso e nessuna filigrana: apri la pagina, scegli un file e leggi la tua trascrizione.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand} trasforma video e audio in testo, direttamente nel tuo browser. Questa pagina spiega in parole semplici cosa significa per i tuoi dati. In breve: il tuo file non lascia mai il tuo dispositivo. Le tue trascrizioni restano solo in questo browser, non esiste alcun account e il sito non imposta cookie propri. Gli annunci compaiono solo nelle pagine informative, e sono forniti da Google, che usa i cookie.',
  '{done} of {total}': '{done} di {total}',
  '{duration} (estimate)': '{duration} (stima)',
  '{gb} GB of memory recommended': '{gb} GB di memoria consigliati',
  '{h} h': '{h} h',
  '{h} h {m} min': '{h} h {m} min',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (al primo utilizzo scarica {size} MB)',
  "{label}, as reported by visitors' browsers":
    '{label}, come comunicato dai browser dei visitatori',
  '{label}: common questions': '{label}: domande frequenti',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. Cercalo tra i tuoi download.',
  '{language} → English': '{language} → inglese',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    "{message} {done} file su {total} erano già in coda; gli altri {left} sono ancora nell'elenco, premi Trascrivi per riprovare.",
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    "{message} {done} file su {total} erano già in coda; l'altro ({left}) è ancora nell'elenco, premi Trascrivi per riprovare.",
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} su questo dispositivo è più lento del tempo reale: {wait} per {audio} di audio (stima). Tiny o Base finiscono prima.',
  '{n} files were skipped: not video or audio.':
    '{n} file sono stati ignorati: non sono video né audio.',
  '{n} h ago': '{n} h fa',
  '{n} min': '{n} min',
  '{n} min ago': '{n} min fa',
  '{n} min left': '{n} min rimanenti',
  '{n} min read': '{n} min di lettura',
  '{n} minute': '{n} minuto',
  '{n} minutes': '{n} minuti',
  '{n} of {total}': '{n} di {total}',
  '{n} of those files are already in the list.': "{n} di quei file sono già nell'elenco.",
  '{n} video transcribed': '{n} video trascritto',
  '{n} videos transcribed': '{n} video trascritti',
  '{n} words': '{n} parole',
  '{n}% done': '{n}% completato',
  '{n}% model confidence': '{n}% di affidabilità del modello',
  '{n}s left': '{n} s rimanenti',
  '{name} home': 'Home di {name}',
  '{size} download': 'Download di {size}',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} Non disponibile su questo dispositivo: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**Un registro tecnico in questa scheda.** La pagina Log mostra il registro tecnico di questa scheda. Resta nel tuo browser e non viene mai inviato da nessuna parte.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    "**Aggiungi un suggerimento di vocabolario**: nomi, marchi e termini tecnici presenti nell'audio, scritti come vuoi vederli.",
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**Aggiungi un suggerimento di vocabolario**: nomi, marchi e termini tecnici, scritti come vuoi vederli.',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**Annunci.** Gli annunci compaiono solo nelle pagine informative, e sono forniti da Google, che usa i cookie. Nessun annuncio viene mostrato mentre un file viene trascritto né accanto alla tua trascrizione.',
  '**Check the marked lines** and fix them in the transcript editor.':
    "**Controlla le righe segnalate** e correggile nell'editor della trascrizione.",
  '**Choose the spoken language** instead of auto-detect.':
    '**Scegli la lingua parlata** invece del rilevamento automatico.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**Scegli il tuo file.** Trascina qui sopra un file video o audio, sceglilo dal tuo dispositivo oppure registra la tua voce con il microfono. Funzionano MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG e la maggior parte degli altri formati comuni.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    "**Migliora l'audio** — filtra rimbombi e fruscio, equilibra chi parla a voce bassa",
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**Limiti dei file.** Nessuno impostato da noi. Il tuo file viene elaborato sul tuo dispositivo, quindi i file molto grandi o lunghi richiedono più tempo e abbastanza memoria libera; la pagina ti avvisa se il dispositivo è lento.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**Tipi di file.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS e MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG e OPUS. Puoi anche registrare direttamente dal microfono.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**I cookie di Google.** Google imposta i propri cookie quando gli annunci vengono caricati, solo nelle pagine che mostrano annunci (vedi la sezione 6).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    "**Lezioni e podcast** trasformati in testo leggibile, per studiare o per le note dell'episodio.",
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**Limiti.** Al momento il server non annuncia alcun limite di dimensione o durata. I file molto grandi richiedono semplicemente più tempo.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**Limiti.** Non impostiamo alcun limite di dimensione o durata: il tuo file viene elaborato sul tuo dispositivo, quindi i file molto grandi o lunghi richiedono semplicemente più tempo e abbastanza memoria libera. Su un dispositivo lento la pagina te lo dice prima di iniziare e stima il tempo.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**I contenuti multimediali che aggiungi.** I file video o audio che scegli o registri. Vengono elaborati nel tuo browser, sul tuo dispositivo (con WebGPU o WebAssembly). Il tuo file non viene mai caricato sui nostri server e non viene mai inviato a Google né a nessun altro.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**Appunti di riunioni e interviste** che puoi cercare, citare e condividere.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**Gli errori capitano.** Nessun riconoscimento vocale è perfetto. Controlla sempre una trascrizione prima di farci affidamento per qualcosa di importante.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**Nessun cookie nostro.** Il sito di per sé non imposta alcun cookie.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    "**Niente viene salvato per dopo.** File e trascrizioni esistono solo per la tua sessione. Esporta ciò che ti serve prima di andare via. I dettagli sono nell'[Informativa sulla privacy](/privacy).",
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    "**Niente viene salvato per dopo.** Le trascrizioni e il file restano solo in questo browser e vengono eliminati automaticamente dopo {idle} di inattività, oppure quando premi **Elimina ora i miei dati**. Esporta ciò che ti serve prima di andare via. I dettagli sono nell'[Informativa sulla privacy](/privacy).",
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    "**Niente viene salvato per dopo.** Le trascrizioni esistono solo per questa sessione, quindi esporta ciò che ti serve. L'[Informativa sulla privacy](/privacy) descrive il sito web ospitato.",
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    "**Un solo totale.** Quando una trascrizione termina, il tuo browser invia un «+1» anonimo al nostro contatore (un Cloudflare Worker). Non contiene file, trascrizioni né identificativi. Cloudflare vede il tuo indirizzo IP durante il transito e lo usa brevemente per limitare gli abusi (un limite di frequenza); noi conserviamo solo il totale. Il numero mostrato nell'intestazione della pagina è comunicato dai browser dei visitatori e non è verificato.",
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    "**Scegli Alta precisione o Massima precisione** per l'audio difficile.",
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**Scegli la qualità e la lingua.** Un modello più veloce dà una bozza rapida; uno più preciso è meglio per interviste, lezioni e sottotitoli. La lingua parlata può essere rilevata per te e sono supportate più di 50 lingue.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    "**Trascrivi di nuovo** una trascrizione terminata con un'altra qualità o lingua; la trascrizione attuale viene conservata.",
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    "**Trascrivi di nuovo** con un'altra qualità o lingua; la trascrizione attuale viene conservata.",
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**Leggi, correggi e scarica.** La trascrizione appare con i timestamp e le parole di cui il modello era incerto sono segnalate, così puoi controllarle. Scaricala come testo semplice, sottotitoli SRT o VTT, Markdown o JSON.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    "**Richieste che consegnano il sito.** Cloudflare (Cloudflare Pages) consegna questo sito web. In quanto nostro fornitore di hosting e di rete, tratta il tuo indirizzo IP e i consueti dati della richiesta (come l'ora, la pagina richiesta e il tuo browser) per consegnare e proteggere il sito.",
  '**Skip silence & music** — prevents made-up text':
    '**Salta silenzi e musica** — evita testo inventato',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**I modelli vocali restano nella cache del tuo browser** (Cache Storage), così la trascrizione successiva parte più in fretta, finché non li elimini (anche **Elimina ora i miei dati** può eliminarli) o il browser svuota la sua memoria. Sono file di programma, non i tuoi dati.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**Velocità.** Dipende dalla qualità che scegli, dalla lunghezza del file e da quanto è occupato il servizio.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**Velocità.** Dipende dal tuo dispositivo, dalla qualità che scegli e dalla lunghezza del file. Al primo utilizzo di un livello di qualità il suo modello viene scaricato una volta: il browser recupera i file del modello da Hugging Face e i file di programma del motore da jsDelivr, poi li tiene in cache. Tieni aperta la scheda mentre lavora.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    "**Parti da un buon audio**: meno rumore di fondo, un microfono vicino e una persona che parla alla volta. Lascia attivo «Migliora l'audio».",
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    "**Parti da un buon audio**: poco rumore di fondo, un microfono vicino, una persona alla volta. Lascia attivo «Migliora l'audio».",
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    "**Memoria nel tuo browser.** Il browser conserva le tue trascrizioni e i tuoi file (IndexedDB) e i modelli vocali (Cache Storage) come descritto sopra, ricorda la tua scelta del tema chiaro o scuro, e la sua memoria di sessione conserva alcune impostazioni di comodità per la scheda corrente (come l'ultima qualità scelta). Niente di tutto questo viene inviato a noi.",
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**Sottotitoli** per i tuoi video, reel e corsi online, da un file SRT o VTT.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**Testo creato sul tuo dispositivo.** La trascrizione, i suoi timestamp e le tue modifiche, il titolo che scegli e le impostazioni che selezioni (qualità, lingua, suggerimento di vocabolario). Vengono creati e conservati in questo browser; noi non li riceviamo mai.',
  '**Use previous text as context** — can repeat on long files':
    '**Usa il testo precedente come contesto** — può ripetersi nei file lunghi',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**Memo vocali** messi per iscritto, così non devi riascoltarli.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    "**Perché i risultati possono differire tra una trascrizione e l'altra, tra livelli di qualità o con altri strumenti?** Il riconoscimento vocale è probabilistico: sceglie le parole più probabili e, nei passaggi rumorosi o ambigui, più risposte sono vicine. Un diverso livello di qualità, un'altra lingua, un suggerimento di vocabolario o una pulizia dell'audio diversa possono cambiare il testo, così come un altro strumento che usa un sistema diverso. I nomi o le etichette di chi parla non vengono aggiunti.",
  '**Word-level timing** — better subtitles and confidence marks':
    '**Tempi per parola** — sottotitoli migliori e indicatori di affidabilità',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**I tuoi file e le tue trascrizioni restano in questo browser.** Trascrizioni, modifiche e file sorgente sono conservati solo nella memoria di questo browser (IndexedDB). Vengono eliminati automaticamente quando la sessione termina, cosa che avviene dopo {idle} di inattività, oppure subito quando premi **Elimina ora i miei dati** nel menu Trascrizioni.',
  '1 file was skipped: not video or audio.': '1 file è stato ignorato: non è video né audio.',
  '1 minute': '1 minuto',
  '1 word': '1 parola',
  '1. Agreement': '1. Accordo',
  '1. Who runs this website': '1. Chi gestisce questo sito',
  '10. Children': '10. Minori',
  '10. Termination': '10. Cessazione',
  '11. Children': '11. Minori',
  '11. Your rights and choices': '11. I tuoi diritti e le tue scelte',
  '12. Changes': '12. Modifiche',
  '12. Open-source components': '12. Componenti open source',
  '13. Changes to this policy': '13. Modifiche a questa informativa',
  '13. Governing law': '13. Legge applicabile',
  '14. Contact': '14. Contatti',
  '2. The service': '2. Il servizio',
  '2. What is processed, and where': '2. Cosa viene trattato e dove',
  '3 simple steps': '3 semplici passaggi',
  '3. Why it is processed': '3. Perché viene trattato',
  '3. Your content': '3. I tuoi contenuti',
  '4. Acceptable use': '4. Uso consentito',
  '4. How long it is kept': '4. Per quanto tempo viene conservato',
  '5. Downloads your browser makes': '5. I download che fa il tuo browser',
  '5. Limits: your device does the work': '5. Limiti: il lavoro lo fa il tuo dispositivo',
  '6. Accuracy: no warranty': '6. Accuratezza: nessuna garanzia',
  '6. Advertising': '6. Pubblicità',
  '7. Availability': '7. Disponibilità',
  '7. Cookies and browser storage': '7. Cookie e memoria del browser',
  '8. Sharing': '8. Condivisione',
  '8. Third-party downloads and ads': '8. Download e annunci di terze parti',
  '9. Liability': '9. Responsabilità',
  '9. Security': '9. Sicurezza',
  'A name cannot be empty, so the old name was kept.':
    'Il nome non può essere vuoto, quindi è stato mantenuto quello precedente.',
  'A new transcript has started. The old one is kept in your list.':
    'È iniziata una nuova trascrizione. Quella precedente resta nel tuo elenco.',
  'a period': 'un certo periodo',
  About: 'Chi siamo',
  'About {brand}': 'Informazioni su {brand}',
  'about {h} h': 'circa {h} h',
  'about {h} h {m} min': 'circa {h} h {m} min',
  'about {n} min': 'circa {n} min',
  'Accurate text': 'Testo accurato',
  'Add another file': 'Aggiungi un altro file',
  'Add your file': 'Aggiungi il tuo file',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    "Gli annunci compaiono solo nelle pagine informative, e sono forniti da Google, che usa i cookie. Nessun annuncio viene mostrato mentre un file viene trascritto né accanto alla tua trascrizione e questo sito non imposta cookie propri. I dettagli sono nell'[Informativa sulla privacy](/privacy).",
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'Gli annunci non servono a nessuna funzione: con gli annunci bloccati o rifiutati, tutto funziona allo stesso modo.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'Gli annunci mantengono TranscribeVid gratuito. Tutto funziona anche senza.',
  Advertisement: 'Pubblicità',
  'All free tools': 'Tutti gli strumenti gratuiti',
  'All free video and audio to text tools': 'Tutti gli strumenti gratuiti da video e audio a testo',
  'All tools': 'Tutti gli strumenti',
  'All your data was deleted': 'Tutti i tuoi dati sono stati eliminati',
  'Allow the microphone in your browser, or choose a file instead.':
    "Consenti l'uso del microfono nel browser, oppure scegli un file.",
  'Already added': 'Già aggiunto',
  'Already finished': 'Già terminata',
  'Also delete the downloaded speech models?': 'Eliminare anche i modelli vocali scaricati?',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'Un caricamento è in corso. Aspetta che finisca prima di aggiungere altri file.',
  'Apply style only': 'Applica solo lo stile',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    "Applica solo lo stile usa il riconoscimento salvato senza elaborare di nuovo l'audio. Le righe modificate vengono conservate.",
  'Audio works too.': "Va bene anche l'audio.",
  'Automatic (IndicXlit when installed)': 'Automatico (IndicXlit se installato)',
  Back: 'Indietro',
  'Basic phonetic spelling': 'Ortografia fonetica di base',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'Poiché non abbiamo alcun account né dati che ti identifichino, di solito non possiamo collegare alcun dato a una persona. Dove la legge ti riconosce diritti sui tuoi dati personali, come accesso, rettifica, cancellazione, limitazione, opposizione e portabilità, o il diritto di presentare reclamo alla tua autorità per la protezione dei dati, puoi esercitarli contattandoci:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'Poiché le tue trascrizioni esistono solo in questo browser, esporta ciò che ti serve prima di andare via. I dati eliminati non si possono recuperare.',
  'Best accuracy': 'Massima precisione',
  'Best accuracy, slowest': 'Massima precisione, più lenta',
  Breadcrumb: 'Percorso di navigazione',
  'By file type': 'Per tipo di file',
  'By language': 'Per lingua',
  'By use': 'Per uso',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'Usando {brand} ({domain}) accetti questi termini. Se non li accetti, non usare il servizio. Il servizio è gestito da **{name}**, {address}.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    "aggirare o tentare di aggirare i limiti di frequenza o la sicurezza del sito o del suo contatore, né interferire con il suo funzionamento o con l'uso che ne fanno gli altri visitatori;",
  'Can I edit the transcript?': 'Posso modificare la trascrizione?',
  "Can't reach the server.": 'Impossibile raggiungere il server.',
  Cancel: 'Annulla',
  'Cancel "{title}"?': 'Annullare «{title}»?',
  'Cancel {title}': 'Annulla {title}',
  'Cancellation requested': 'Annullamento richiesto',
  Cancelled: 'Annullata',
  'Cancelling…': 'Annullamento in corso…',
  'Cannot reach the server': 'Impossibile raggiungere il server',
  'Cannot reach the server.': 'Impossibile raggiungere il server.',
  'Cannot reach the server. Check your connection and try again.':
    'Impossibile raggiungere il server. Controlla la connessione e riprova.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'Impossibile raggiungere il server. Assicurati che sia in esecuzione (npm run dev) e riprova.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'Modifica o elimina una riga, oppure cerca e sostituisci. Le tue modifiche sono in ogni download.',
  'Changed in {n} lines.': 'Modificate {n} righe.',
  'Check Hinglish spelling': "Controlla l'ortografia dell'hinglish",
  'Choose "Save as PDF" in the print dialog.': 'Nella finestra di stampa scegli «Salva come PDF».',
  'Choose a file': 'Scegli un file',
  'Choose a file first': 'Scegli prima un file',
  'Choose a format': 'Scegli un formato',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'Scegli tra modelli più veloci e più precisi, a seconda del tuo dispositivo e del tempo che hai.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'Scegli Più veloce, Standard, Alta precisione o Massima precisione: Più veloce è il più rapido, Massima precisione commette meno errori.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'Scegli la lingua parlata o lascia il rilevamento automatico. Puoi anche tradurre il parlato in inglese.',
  'Chosen files': 'File scelti',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    "Un parlato chiaro vicino al microfono dà il risultato migliore. In Altre opzioni, **Migliora l'audio** e **Salta silenzi e musica** sono attivi per impostazione predefinita: filtrano rimbombi e fruscio e impediscono al modello di inventare testo durante la musica o le pause lunghe, quindi lasciali attivi per le registrazioni rumorose. Per i sottotitoli tieni attivi anche i **Tempi per parola**, così ogni riga inizia e finisce esattamente con le parole.",
  Close: 'Chiudi',
  'Close menu': 'Chiudi il menu',
  'Close: {title}': 'Chiudi: {title}',
  'Common questions': 'Domande frequenti',
  Contact: 'Contatti',
  'Converting…': 'Conversione in corso…',
  Copied: 'Copiato',
  'Copy text': 'Copia il testo',
  'Copying…': 'Copia in corso…',
  'Could not cancel the transcript.': 'Non è stato possibile annullare la trascrizione.',
  'Could not change transcript style.':
    'Non è stato possibile cambiare lo stile della trascrizione.',
  'Could not copy': 'Copia non riuscita',
  'Could not delete the transcript.': 'Non è stato possibile eliminare la trascrizione.',
  'Could not delete your data.': 'Non è stato possibile eliminare i tuoi dati.',
  'Could not load the text to copy.': 'Non è stato possibile caricare il testo da copiare.',
  'Could not prepare the file. Please try again.':
    'Non è stato possibile preparare il file. Riprova.',
  'Could not rename the transcript.': 'Non è stato possibile rinominare la trascrizione.',
  'Could not save the change.': 'Non è stato possibile salvare la modifica.',
  'Could not start': 'Avvio non riuscito',
  'Could not start.': 'Avvio non riuscito.',
  Dark: 'Scuro',
  Delete: 'Elimina',
  'Delete "{title}" and its transcript?': 'Eliminare «{title}» e la sua trascrizione?',
  'Delete "{title}"? This cannot be undone.':
    "Eliminare «{title}»? L'operazione non si può annullare.",
  'Delete {title}': 'Elimina {title}',
  'Delete all your transcripts and the files kept in this browser now?':
    'Eliminare subito tutte le tue trascrizioni e i file conservati in questo browser?',
  'Delete all your transcripts and uploaded files now?':
    'Eliminare subito tutte le tue trascrizioni e i file caricati?',
  'Delete line': 'Elimina riga',
  'Delete my data now': 'Elimina ora i miei dati',
  'Delete this line from the transcript?': 'Eliminare questa riga dalla trascrizione?',
  'Delete transcript': 'Elimina trascrizione',
  Deleted: 'Eliminato',
  'Detect automatically': 'Rileva automaticamente',
  'Dismiss message': 'Chiudi il messaggio',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 capisce solo il parlato inglese. Scegli un altro modello per tradurre.',
  Done: 'Fatto',
  'Download failed': 'Download non riuscito',
  'Download started': 'Download avviato',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'Scarica il risultato come testo semplice, sottotitoli SRT o VTT, Markdown o JSON.',
  'Download the transcript as': 'Scarica la trascrizione come',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'Download del modello vocale (solo la prima volta): {loaded} di {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'Trascina un file video o audio nella [home page](/), oppure registra dal microfono.',
  'Drop to add your file': 'Rilascia per aggiungere il tuo file',
  'Drop your {noun} here, or choose a file': 'Trascina qui {noun} oppure scegli un file',
  'Each line with its time, like [00:12]': 'Ogni riga con il suo orario, come [00:12]',
  Edit: 'Modifica',
  'Edit it right here': 'Modificala qui stesso',
  'Edit this line': 'Modifica questa riga',
  'Edited by you': 'Modificata da te',
  'English only, very fast and accurate': 'Solo inglese, molto veloce e preciso',
  'English translation is selected in More options.':
    'In Altre opzioni è selezionata la traduzione in inglese.',
  'Enter saves · Esc cancels': 'Invio salva · Esc annulla',
  'Every line has a time. Play the media from any line to hear what was said.':
    'Ogni riga ha un orario. Riproduci il file da qualsiasi riga per sentire cosa è stato detto.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'Ogni pagina fa lo stesso lavoro: trasforma il parlato di un file video o audio in testo con un timestamp su ogni riga, in più di 50 lingue, senza registrazione. Scegli quella che corrisponde al file che hai o a ciò che vuoi ottenere.',
  'Experimental: compare on your audio; chunk timestamps':
    'Sperimentale: confrontalo sul tuo audio; timestamp per blocchi',
  'Experimental: larger model; chunk timestamps':
    'Sperimentale: modello più grande; timestamp per blocchi',
  Export: 'Esporta',
  Failed: 'Non riuscita',
  FAQ: 'FAQ',
  Fast: 'Veloce',
  'Fast, clean audio': 'Veloce, audio pulito',
  Fastest: 'Più veloce',
  'Fastest, rough drafts only': 'Il più veloce, solo bozze approssimative',
  'Fewer mistakes. Takes longer.': 'Meno errori. Richiede più tempo.',
  'Fewest mistakes. Takes the longest.': 'Il minor numero di errori. Richiede più tempo di tutti.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'Il file «{name}» pesa {size}; il limite è {limit} - imposta VT_MAX_UPLOAD_MB per alzarlo',
  'File "{name}" is {size}; the limit is {limit}.':
    'Il file «{name}» pesa {size}; il limite è {limit}.',
  'file {n} of {total}': 'file {n} di {total}',
  'File added': 'File aggiunto',
  'File limits.': 'Limiti dei file.',
  'File not added': 'File non aggiunto',
  'File skipped': 'File ignorato',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    "File e trascrizioni esistono solo per la tua sessione. Esporta ciò che ti serve prima di andare via. L'unica cosa che conserviamo è un totale anonimo di quanti file sono stati trascritti sul sito (un solo numero, mostrato nell'intestazione della pagina); non è collegato a te, ai tuoi file né alla tua sessione. I dettagli sono nell'[Informativa sulla privacy](/privacy).",
  'Find it automatically': 'Rilevala automaticamente',
  'first time only, also downloads the {size} MB word-timing model':
    'solo la prima volta, scarica anche il modello per i tempi per parola da {size} MB',
  'First time only: downloads {size} (needs internet)':
    'Solo la prima volta: scarica {size} (serve internet)',
  'Follow playback': 'Segui la riproduzione',
  'Following playback': 'Segue la riproduzione',
  Footer: 'Piè di pagina',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'Per un parlato con accento o in più lingue, prova un livello di qualità più alto. Il punteggio di affidabilità non è una percentuale di precisione.',
  'For developers: words, times, confidence': 'Per sviluppatori: parole, tempi, affidabilità',
  'For notes apps': 'Per le app di appunti',
  'For video players and editors': 'Per lettori video ed editor',
  'For YouTube and web video': 'Per YouTube e video sul web',
  Free: 'Gratis',
  'Free tools': 'Strumenti gratuiti',
  'Free tools:': 'Strumenti gratuiti:',
  'Free video and audio to text': 'Da video e audio a testo, gratis',
  'Free video and audio to text, right in your browser':
    'Da video e audio a testo, gratis, direttamente nel tuo browser',
  'Free, unlimited, and no login needed': 'Gratis, senza limiti e senza bisogno di registrazione',
  'Free, unlimited, no login': 'Gratis, senza limiti, senza registrazione',
  'Frequently asked questions': 'Domande frequenti',
  'Get in touch': 'Contattaci',
  'Getting the speech engine ready…': 'Preparazione del motore vocale…',
  'Give it a new name': 'Dagli un nuovo nome',
  'Go to the home page': 'Vai alla home page',
  'Go to Video to text': 'Vai a Video in testo',
  'Good balance (default)': 'Buon equilibrio (predefinito)',
  'Good to know': 'Da sapere',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Non è stato possibile caricare lo strumento di consenso di Google, probabilmente perché un blocco annunci o la rete lo ha fermato. Senza di esso non vengono caricati annunci né cookie pubblicitari.',
  Guides: 'Guide',
  'Guides: transcripts and subtitles': 'Guide: trascrizioni e sottotitoli',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'Hai una domanda, hai trovato un errore o vuoi suggerire una funzione? Scrivi a {email}. Ogni messaggio viene letto da chi realizza {brand} e di solito ricevi una risposta entro pochi giorni lavorativi.',
  'Helps spell uncommon words correctly.': 'Aiuta a scrivere correttamente le parole insolite.',
  'High accuracy': 'Alta precisione',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'Alta precisione (Large v3 Turbo) non è stato addestrato per tradurre e potrebbe restituire la lingua originale. Per la traduzione scegli Standard o Massima precisione.',
  'High accuracy, slower': 'Alta precisione, più lenta',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    "Un valore più alto è un po' più preciso e più lento. 5 è un buon valore predefinito.",
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    "Hindi in caratteri latini, con le parole inglesi lasciate com'erano. Le altre lingue mantengono la scrittura originale. Controlla le parole e i nomi poco comuni.",
  'Hinglish (Roman Hindi)': 'Hinglish (hindi in caratteri latini)',
  'Hinglish conversion': 'Conversione in hinglish',
  History: 'Cronologia',
  Home: 'Home',
  'How {brand} works': 'Come funziona {brand}',
  'How accurate is it?': 'Quanto è preciso?',
  'How do I get better accuracy?': 'Come ottengo una precisione migliore?',
  'How it stays free': 'Come resta gratuito',
  'How it works': 'Come funziona',
  'How long does it take?': 'Quanto tempo ci vuole?',
  'How to transcribe a video to text': 'Come trascrivere un video in testo',
  'How to turn a video or audio file into text with {brand}':
    'Come trasformare un file video o audio in testo con {brand}',
  'If it does have speech, try More › Re-transcribe with the right language.':
    "Se c'è del parlato, prova Altro › Trascrivi di nuovo con la lingua giusta.",
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'Se il servizio è occupato o ci sono già troppe trascrizioni in corso, ti chiede di aspettare e ti dice perché.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'Se modifichiamo questa informativa, la nuova versione compare in questa pagina con una nuova data di «Ultimo aggiornamento».',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'Nello SEE, nel Regno Unito e in Svizzera, e in alcuni stati degli USA, il messaggio di consenso certificato di Google ti chiede la tua scelta quando gli annunci vengono caricati.',
  'IndicXlit (trained model)': 'IndicXlit (modello addestrato)',
  'Is it really free and unlimited? Do I need to log in?':
    'È davvero gratuito e senza limiti? Devo accedere?',
  'Is my data private?': 'I miei dati sono privati?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    "Dipende dalla qualità che scegli, dalla lunghezza del file e da quanto è occupato il servizio. Più veloce è rapido; Massima precisione richiede più tempo ma commette meno errori. L'avanzamento e il tempo rimanente sono mostrati in tempo reale, e un file in attesa del suo turno mostra «In attesa in coda».",
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    "Dipende dal tuo dispositivo, dalla qualità che scegli e dalla lunghezza del file. Con una scheda grafica adeguata (WebGPU) è più veloce; altrimenti funziona sul processore (WebAssembly), che è più lento. Più veloce è rapido; Massima precisione richiede più tempo ma commette meno errori. L'avanzamento e il tempo rimanente sono mostrati in tempo reale.",
  'It is now called “{title}”.': 'Ora si chiama «{title}».',
  'It may have been deleted.': 'Potrebbe essere stato eliminato.',
  'It was stopped before any text was found.':
    'È stata interrotta prima che venisse trovato del testo.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'I suoi dati sono stati eliminati, compresa questa trascrizione. Le trascrizioni vengono conservate solo per la sessione che le ha create.',
  'Job not found': 'Lavoro non trovato',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'proprio adesso',
  'Just the words, in paragraphs': 'Solo le parole, in paragrafi',
  'Keep reading': 'Continua a leggere',
  'Keep this page open until the upload is done.':
    'Tieni aperta questa pagina finché il caricamento non è finito.',
  'Kept only for this session, then deleted automatically.':
    'Conservati solo per questa sessione, poi eliminati automaticamente.',
  Language: 'Lingua',
  'Larger or longer files are refused before they are processed, so split them first.':
    "I file più grandi o più lunghi vengono rifiutati prima dell'elaborazione, quindi dividili prima.",
  'Last updated: {date}': 'Ultimo aggiornamento: {date}',
  'Licence text': 'Testo della licenza',
  Light: 'Chiaro',
  'Limits.': 'Limiti.',
  'Line deleted': 'Riga eliminata',
  'Live: the text appears here as it is recognised':
    'In diretta: il testo appare qui man mano che viene riconosciuto',
  'Loading model… (first use downloads it)':
    'Caricamento del modello… (al primo utilizzo viene scaricato)',
  'Loading…': 'Caricamento…',
  'Long (56 letters)': 'Lunga (56 caratteri)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'Risposte più approfondite: formati, sottotitoli, precisione e privacy.',
  Main: 'Principale',
  'Make a new transcript of the same file. This one is kept.':
    'Crea una nuova trascrizione dello stesso file. Questa viene conservata.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'Crea un file di sottotitoli (SRT o VTT) dal tuo video.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'Menu',
  Model: 'Modello',
  More: 'Altro',
  'More answers: [Frequently asked questions](/faq)': 'Altre risposte: [Domande frequenti](/faq)',
  'More free tools': 'Altri strumenti gratuiti',
  'More options': 'Altre opzioni',
  'More than 50 languages': 'Più di 50 lingue',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'Più di 50 lingue, tra cui inglese, spagnolo, francese, tedesco, portoghese, italiano, olandese, russo, arabo, hindi, cinese, giapponese e coreano. Lascia il rilevamento automatico della lingua o sceglila tu. Puoi anche tradurre il parlato in inglese.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'La maggior parte dei siti di trascrizione ti chiede di creare un account, limita i minuti gratuiti, aggiunge filigrane o ti spinge verso un abbonamento prima che tu veda una sola riga di testo. {brand} fa il contrario. Tutto ciò che offre è disponibile per tutti e la pagina non chiede altro che il tuo file.',
  'Name not changed': 'Nome non modificato',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    "Nomi, marchi e termini tecnici presenti nell'audio, ad es. Kubernetes, dott. Okafor",
  'Near-best accuracy, much faster than Large':
    'Precisione quasi ottima, molto più veloce di Large',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'richiede il supporto degli shader a 16 bit (shader-f16) nel driver grafico',
  'needs 4 GB': 'richiede 4 GB',
  'needs 8 GB': 'richiede 8 GB',
  'needs a graphics-capable browser (Chrome, Edge)':
    'richiede un browser con supporto grafico (Chrome, Edge)',
  'needs WebGPU': 'richiede WebGPU',
  'Next match': 'Risultato successivo',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'Nessun account e nessun tracciamento. I tuoi file vengono conservati solo per la tua sessione e poi eliminati automaticamente.',
  'no estimate for this model here': 'nessuna stima per questo modello qui',
  'No login': 'Senza registrazione',
  'No matches': 'Nessun risultato',
  'No microphone': 'Nessun microfono',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'Nessuna registrazione, nessun pagamento, nessun limite giornaliero. Aggiungi solo il tuo file.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'Al momento il server non annuncia alcun limite di dimensione o durata. I file molto grandi richiedono semplicemente più tempo.',
  'No speech was found in this file.': 'In questo file non è stato trovato alcun parlato.',
  'No speech was transcribed.': 'Nessun parlato è stato trascritto.',
  'No speech was transcribed. Check the recording and the selected language.':
    'Nessun parlato è stato trascritto. Controlla la registrazione e la lingua selezionata.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    "Qui non c'è WebGPU: i modelli girano su un solo thread della CPU, quindi le dimensioni maggiori sono più lente del tempo reale.",
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    "Nessun altro file passa prima del tuo. Se aggiungi più file, vengono trascritti uno dopo l'altro nella tua scheda, quindi tieni aperta la scheda finché non hanno finito.",
  'None of those are video or audio files.': 'Nessuno di quei file è video o audio.',
  Normal: 'Normale',
  'not available for this size': 'non disponibile per queste dimensioni',
  'not available in this browser': 'non disponibile in questo browser',
  'not available with Qwen (times are per chunk)':
    'non disponibile con Qwen (i tempi sono per blocco)',
  'Not cancelled': 'Non annullata',
  'Not deleted': 'Non eliminato',
  'Not renamed': 'Non rinominata',
  'Not saved': 'Non salvato',
  Note: 'Nota',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'Ancora niente qui. Le trascrizioni che crei compaiono qui per questa sessione.',
  'Nothing is saved. Export what you need.': 'Niente viene salvato. Esporta ciò che ti serve.',
  'Nothing is uploaded until you press Transcribe.':
    'Non viene caricato nulla finché non premi Trascrivi.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'Niente registrazione e niente da pagare. Aggiungi solo il tuo file.',
  'Nothing was recorded.': 'Non è stato registrato nulla.',
  Off: 'Disattivo',
  On: 'Attivo',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    "Con un parlato chiaro in una lingua supportata di solito è molto preciso, ma nessun riconoscimento vocale è perfetto. La precisione dipende dalla qualità dell'audio, dagli accenti, dal rumore di fondo, da più persone che parlano insieme, dalla musica e da nomi rari o termini tecnici. Ogni riga ha un punteggio di affidabilità e le righe con affidabilità bassa sono segnalate, così puoi controllarle per prime. Controlla sempre una trascrizione prima di farci affidamento per qualcosa di importante.",
  'Open menu': 'Apri il menu',
  'Opening your transcript…': 'Apertura della trascrizione…',
  'or drop it anywhere on this page.': 'oppure trascinalo in un punto qualsiasi di questa pagina.',
  'Original script': 'Scrittura originale',
  Output: 'Risultato',
  'Page {page} of {pages}': 'Pagina {page} di {pages}',
  'Page not found': 'Pagina non trovata',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'Pagine per il file che hai già: WAV, M4A, WebM e MOV.',
  'PDF document (.pdf)': 'Documento PDF (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'Il PDF lo crea il tuo browser: nella finestra di stampa scegli «Salva come PDF».',
  'Pick quality': 'Scegli la qualità',
  'Plain text (.txt)': 'Testo semplice (.txt)',
  'Play from here': 'Riproduci da qui',
  'Playback speed': 'Velocità di riproduzione',
  'Please add one file at a time here. You can add more files on the next page.':
    'Aggiungi un solo file alla volta qui. Nella pagina successiva puoi aggiungerne altri.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'Non inviare registrazioni private. {brand} trascrive i tuoi file sul tuo dispositivo e noi non li riceviamo mai, quindi non ci servono per aiutarti.',
  'Please note': 'Attenzione',
  Preparing: 'Preparazione',
  'Preparing audio…': "Preparazione dell'audio…",
  'Preparing the audio…': "Preparazione dell'audio…",
  'Preparing…': 'Preparazione…',
  'Press a question to read its answer.': 'Premi una domanda per leggere la risposta.',
  'Previous match': 'Risultato precedente',
  'Print to PDF': 'Stampa in PDF',
  Privacy: 'Privacy',
  'Privacy and cookie settings': 'Impostazioni di privacy e cookie',
  'Privacy policy': 'Informativa sulla privacy',
  'Privacy requests': 'Richieste sulla privacy',
  Private: 'Privato',
  Progress: 'Avanzamento',
  Quality: 'Qualità',
  'Questions about these terms:': 'Domande su questi termini:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'Domande, segnalazioni di errori e idee sono sempre benvenute. Scrivi a {email} oppure consulta la pagina [Contatti](/contact) per sapere cosa includere.',
  Queued: 'In coda',
  'Quick results. Good for clear speech.': 'Risultati rapidi. Adatto a un parlato chiaro.',
  Quickest: 'Il più rapido',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    "Qwen usa timestamp approssimativi per blocchi. I tempi per parola e l'affidabilità non sono disponibili.",
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    "Qwen usa timestamp per blocchi e non fornisce l'affidabilità per parola. Confronta un breve campione prima di sceglierlo.",
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (sperimentale)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR richiede un browser desktop con WebGPU (Chrome o Edge) e il supporto degli shader a 16 bit (shader-f16) nel driver grafico.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR richiede un browser desktop con WebGPU (Chrome o Edge) e 8 GB di memoria.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR richiede un browser desktop con WebGPU (Chrome o Edge).',
  'Re-transcribe': 'Trascrivi di nuovo',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'Leggi la trascrizione con i timestamp, vedi di quali parole il modello era incerto e correggile direttamente.',
  'Read, edit, download': 'Leggi, modifica, scarica',
  Ready: 'Pronto',
  'Ready to print or share': 'Pronto per stampare o condividere',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'Vuoi provare? [Vedi tutti gli strumenti gratuiti](/tools) oppure [trascrivi subito un file](/).',
  'Recognition engine': 'Motore di riconoscimento',
  Recommended: 'Consigliato',
  'Record from microphone': 'Registra dal microfono',
  'Record straight from your microphone and turn it into text.':
    'Registra direttamente dal microfono e trasformalo in testo.',
  'Record with your microphone': 'Registra con il microfono',
  'Recording {stamp}': 'Registrazione {stamp}',
  'Recording is not supported by this browser.':
    'La registrazione non è supportata da questo browser.',
  'Related reading': 'Letture correlate',
  Remove: 'Rimuovi',
  'Remove {name}': 'Rimuovi {name}',
  'Removes it for good': 'La elimina definitivamente',
  Rename: 'Rinomina',
  Renamed: 'Rinominata',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    'Sostituire «{query}» con «{replacement}» in {n} righe?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    'Sostituire «{query}» con «{replacement}» in 1 riga?',
  'Replace in {n} lines': 'Sostituisci in {n} righe',
  'Replace in 1 line': 'Sostituisci in 1 riga',
  'Replace with': 'Sostituisci con',
  'Replace with…': 'Sostituisci con…',
  'Replace…': 'Sostituisci…',
  Replaced: 'Sostituito',
  'Reporting a problem': 'Segnalare un problema',
  'Retrying…': 'Nuovo tentativo…',
  'Review language and quality': 'Controlla lingua e qualità',
  'Review this transcript': 'Controlla questa trascrizione',
  Save: 'Salva',
  Saved: 'Salvato',
  'Saving…': 'Salvataggio…',
  'Search depth: {n}': 'Profondità di ricerca: {n}',
  'Search the text': 'Cerca nel testo',
  'Search the transcript': 'Cerca nella trascrizione',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'Vedi anche i [Termini di utilizzo](/terms), [Come funziona](/how-it-works) e le [FAQ](/faq).',
  'Server busy': 'Server occupato',
  'Session only — nothing is saved.': 'Solo sessione — non viene salvato nulla.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    "Solo sessione — non viene salvato nulla. Chiudendo l'app si cancellano tutte le trascrizioni. Esporta ciò che ti serve.",
  'Session time left: about {n} min': 'Tempo di sessione rimasto: circa {n} min',
  'Short (32 letters)': 'Corta (32 caratteri)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'Risposte brevi e pratiche su come trasformare il parlato in testo e sottotitoli: quale formato di sottotitoli scegliere, come aggiungere i sottotitoli a un video, come ottenere una trascrizione più accurata e come la trascrizione può funzionare nel tuo browser senza caricare il file.',
  'Show all {count} languages': 'Mostra tutte le {count} lingue',
  'Six ways to download': 'Sei modi per scaricare',
  'Skip to main content': 'Vai al contenuto principale',
  Slower: 'Più lenta',
  'slower than real time on the measured laptop':
    'più lento del tempo reale sul portatile misurato',
  Slowest: 'La più lenta',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'Alcune funzioni scaricano componenti open source nel tuo browser quando le usi. Funzionano sul tuo dispositivo come il resto del motore. Le loro licenze ci chiedono di mostrare questi avvisi:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    "Alcuni passaggi richiedono un controllo all'ascolto a causa di testo ripetuto o di un confine incerto nel parlato.",
  'Something went wrong': 'Qualcosa è andato storto',
  'Something went wrong in this browser. Please try again.':
    'Qualcosa è andato storto in questo browser. Riprova.',
  'Something went wrong while reading this file.':
    'Qualcosa è andato storto durante la lettura di questo file.',
  'Source code': 'Codice sorgente',
  Speed: 'Velocità',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'Le velocità su telefoni e tablet sono stimate, non misurate; Tiny e Base sono le dimensioni sicure.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT e VTT per i sottotitoli, TXT e Markdown per la lettura, JSON per i programmi o un PDF da stampare.',
  Standard: 'Standard',
  'Standard (42 letters)': 'Standard (42 caratteri)',
  Start: 'Avvia',
  'Start a new transcription': 'Avvia una nuova trascrizione',
  'Start again': 'Ricomincia',
  'Started again': 'Ripartita',
  'Starting…': 'Avvio…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'Hai ancora una domanda? Leggi le [domande frequenti](/faq), scopri [come funziona](/how-it-works) o [contattaci](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    'Sei ancora bloccato? [Leggi Come funziona](/how-it-works)',
  'Stop recording · {time}': 'Interrompi la registrazione · {time}',
  'Stop this transcription? The text found so far is kept.':
    'Interrompere questa trascrizione? Il testo trovato finora viene conservato.',
  'Stopping the transcription worker. The text found so far is kept.':
    'Interruzione del processo di trascrizione. Il testo trovato finora viene conservato.',
  'Stored on this device only, never uploaded.':
    'Conservato solo su questo dispositivo, mai caricato.',
  'Style unchanged': 'Stile invariato',
  'Style updated': 'Stile aggiornato',
  'Style updated using the saved recognition. Edited lines are kept.':
    'Stile aggiornato usando il riconoscimento salvato. Le righe modificate vengono conservate.',
  'Subtitle files': 'File di sottotitoli',
  'Subtitle line length': 'Lunghezza delle righe dei sottotitoli',
  'Subtitles (.srt)': 'Sottotitoli (.srt)',
  'Switch to dark theme': 'Passa al tema scuro',
  'Switch to light theme': 'Passa al tema chiaro',
  Terms: 'Termini',
  'Terms of use': 'Termini di utilizzo',
  'Text with times (.txt)': 'Testo con orari (.txt)',
  'That file is already in the list.': "Quel file è già nell'elenco.",
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'Questo non è un file video o audio. Scegli un MP4, MOV, MP3 o un altro file video o audio.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'Questo non è un file video o audio. Scegli un file video o audio.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'Questo non è un file audio. Scegli un MP3, WAV, M4A o un altro file audio.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    "L'[Informativa sulla privacy](/privacy) spiega cosa viene trattato e perché. Per fare una domanda sui tuoi dati o esercitare i tuoi diritti, scrivi allo stesso indirizzo.",
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'Il modello {label} non può funzionare su questo dispositivo: {reason}. Scegline un altro.',
  'the exact error message, or a screenshot of it.':
    'il messaggio di errore esatto, oppure una schermata.',
  'The file is larger than the server accepts.':
    'Il file è più grande di quanto il server accetti.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'La prima volta che usi un livello di qualità, il browser scarica il suo modello vocale una volta e lo conserva per la volta successiva, così i file successivi partono prima.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    "La prima volta che usi un livello di qualità, il browser scarica il modello vocale da Hugging Face e i file di programma del motore da jsDelivr, e li conserva per la volta successiva; insieme a essi non viene inviato nulla del tuo file. Quando una trascrizione termina, il browser aggiunge uno al contatore anonimo nell'intestazione della pagina, e nient'altro.",
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    "Il driver grafico non ha shader a 16 bit: i download sono più grandi e l'uso di memoria è maggiore.",
  'The line was removed.': 'La riga è stata rimossa.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'Gli strumenti principali: trasforma qualsiasi file video o audio in una trascrizione con timestamp.',
  'The page you are looking for does not exist or has moved.':
    'La pagina che cerchi non esiste o è stata spostata.',
  'The recording failed. Please try again.': 'La registrazione non è riuscita. Riprova.',
  'The server does not have enough free disk space for this file.':
    'Il server non ha abbastanza spazio libero su disco per questo file.',
  'The server is busy': 'Il server è occupato',
  'The server is busy right now.': 'Il server è occupato in questo momento.',
  'The service is busy right now. Please wait a moment and try again.':
    'Il servizio è occupato in questo momento. Attendi un attimo e riprova.',
  'The service is full right now. Please try again in a little while.':
    'Il servizio è al completo in questo momento. Riprova tra poco.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    "Il riconoscimento vocale funziona all'interno del tuo browser, usando modelli di riconoscimento vocale aperti come OpenAI Whisper. Il browser scarica il modello una volta e lo conserva, poi fa tutto il lavoro sul tuo dispositivo. Il tuo video o audio non viene mai caricato da noi, ed è anche per questo che non c'è alcun limite di dimensione dei file né una coda di file di altre persone. La pagina [Come funziona](/how-it-works) spiega ogni passaggio.",
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'Non è stato possibile identificare con sicurezza la lingua parlata. Scegli la lingua che senti e riprova.',
  'The text found before it was stopped is shown below.':
    "Il testo trovato prima dell'interruzione è mostrato qui sotto.",
  'The text found so far is kept.': 'Il testo trovato finora viene conservato.',
  'The text is ready to paste.': 'Il testo è pronto da incollare.',
  'The transcript finished before it could be cancelled.':
    'La trascrizione è terminata prima di poter essere annullata.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'La trascrizione funziona sul tuo dispositivo con modelli di riconoscimento vocale aperti come OpenAI Whisper. Il browser scarica un modello una volta e lo conserva, così il file successivo parte più in fretta, e il tuo video o audio non viene mai caricato da nessuna parte.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'il tipo e la durata del file, ad esempio «MP4, 25 minuti»;',
  'There is no size or length limit set here.':
    'Qui non è impostato alcun limite di dimensione o durata.',
  'These details make a problem much quicker to find and fix:':
    'Questi dettagli rendono un problema molto più rapido da trovare e risolvere:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    "Questi termini sono regolati dalle leggi dell'India. I tribunali di Bengaluru, Karnataka, India hanno giurisdizione esclusiva su qualsiasi controversia che ne derivi. Ciò non toglie alcuna tutela di cui godi in base alle leggi obbligatorie a tutela dei consumatori del paese in cui vivi.",
  'They are downloaded again the next time you transcribe.':
    'Vengono scaricati di nuovo la prossima volta che trascrivi.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    "I fornitori terzi, tra cui Google, usano i cookie per mostrare annunci in base alle tue visite precedenti a questo sito o ad altri siti. L'uso dei cookie pubblicitari da parte di Google consente a Google e ai suoi partner di mostrarti annunci in base alla tua visita a questo sito e/o ad altri siti su Internet.",
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'Questo riquadro accetta file audio come MP3, WAV o M4A, ma quello è un video.',
  'This browser cannot record. Please choose a file instead.':
    'Questo browser non può registrare. Scegli invece un file.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'Questo browser non comunica la memoria; si presumono {gb} GB. Scegli un modello più piccolo se la pagina diventa lenta.',
  'This cannot be undone. Export anything you want to keep first.':
    "L'operazione non si può annullare. Esporta prima tutto ciò che vuoi conservare.",
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    "Questa copia di {brand} funziona sul tuo computer. I tuoi file vengono elaborati su questa macchina e nulla ne esce. Niente viene salvato in modo permanente: le trascrizioni esistono solo per questa sessione, quindi esporta ciò che ti serve. L'[Informativa sulla privacy](/privacy) descrive il sito web ospitato.",
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'Questa copia funziona sul tuo computer. I tuoi file vengono elaborati su questa macchina e nulla ne esce.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Questo dispositivo ha poca memoria per un file così lungo. Viene elaborato a piccoli pezzi, il che è più lento; un taglio più corto o un modello più piccolo è più sicuro.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'Questo file richiede un convertitore da 9 MB che funziona nel tuo browser. Caricarlo?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'Questa è una traduzione fornita per comodità. In caso di differenze rispetto alla versione inglese, prevale la versione inglese.',
  'This local copy does not count transcriptions': 'Questa copia locale non conta le trascrizioni',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'Questa trascrizione ha una bassa affidabilità del modello. Ascolta la registrazione e controlla la lingua parlata prima di usare il testo.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'Su questo dispositivo ci vorranno {wait} (stima). Tieni aperta la scheda finché non finisce.',
  Timestamps: 'Timestamp',
  'Tips for the best results': 'Consigli per ottenere i migliori risultati',
  'Tips for the best transcript': 'Consigli per ottenere la trascrizione migliore',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'Per modificare le tue scelte sugli annunci, usa le [Impostazioni annunci di Google](https://adssettings.google.com) o le impostazioni dei cookie del tuo browser.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'Per modificare le tue scelte sugli annunci, usa **Impostazioni di privacy e cookie** in fondo a una pagina che mostra annunci, le [Impostazioni annunci di Google](https://adssettings.google.com) o le impostazioni dei cookie del tuo browser.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'Per darti la trascrizione che hai richiesto sul tuo dispositivo, per consegnare il sito in modo sicuro e per mantenere il servizio gratuito tramite la pubblicità. Dove si applica una legge sulla protezione dei dati come il GDPR, le nostre basi giuridiche sono la fornitura del servizio che hai richiesto (art. 6(1)(b)), il nostro legittimo interesse per la sicurezza, la prevenzione degli abusi e il totale anonimo (art. 6(1)(f)) e, per i cookie pubblicitari dove la legge lo richiede, il tuo consenso (art. 6(1)(a)), che viene richiesto dal messaggio di consenso di Google.',
  'To keep it fast for everyone, each file has a size and length limit.':
    'Per mantenerlo veloce per tutti, ogni file ha un limite di dimensione e durata.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    "Nei limiti consentiti dalla legge, non siamo responsabili per perdite indirette o consequenziali, per perdita di dati, profitti o attività, né per alcuna perdita derivante dall'uso o dall'impossibilità di usare il servizio o da errori in una trascrizione. Nulla in questi termini limita una responsabilità che per legge non può essere limitata.",
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'Per trascrivere sul tuo dispositivo, il browser scarica i file del modello vocale da Hugging Face (huggingface.co) e i file di programma del motore vocale da jsDelivr (cdn.jsdelivr.net), e li conserva nella sua cache (Cache Storage) per la volta successiva finché non li elimini. Questi fornitori ricevono i consueti dati della richiesta (il tuo indirizzo IP, il tuo browser e quale file è stato richiesto), mai i tuoi contenuti multimediali né la tua trascrizione.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'Per funzionare sul tuo dispositivo, il browser scarica modelli vocali da Hugging Face e file di programma da jsDelivr; sono forniti con le proprie licenze e condizioni. Gli annunci sono forniti da Google AdSense; un annuncio porta a un sito web di terzi che non controlliamo e di cui non siamo responsabili.',
  Transcribe: 'Trascrivi',
  'Transcribe (same language)': 'Trascrivi (stessa lingua)',
  'Transcribe {n} files': 'Trascrivi {n} file',
  'Transcribe a file': 'Trascrivi un file',
  'Transcribe or translate speech in the language you need.':
    'Trascrivi o traduci il parlato nella lingua che ti serve.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'Trascrivi video, file audio e registrazioni vocali in più di 50 lingue, oppure lascia che la lingua venga rilevata per te.',
  'Transcribing {n}%': 'Trascrizione {n}%',
  'Transcribing takes {time} on this device.':
    'Su questo dispositivo la trascrizione richiede {time}.',
  'Transcribing…': 'Trascrizione in corso…',
  '{blurb} Not sure? Keep this one.': '{blurb} Non sei sicuro? Tieni questo.',
  '{reason} Retrying in {n} s…': '{reason} Nuovo tentativo tra {n} s…',
  'Alternatives': 'Alternative',
  'Checking the downloaded file…': 'Verifica del file scaricato…',
  'Connection lost.': 'Connessione persa.',
  'Continued after the page reloaded.': 'Ripreso dopo il ricaricamento della pagina.',
  'Continuing the download ({size} already saved)': 'Ripresa del download ({size} già salvati)',
  'Downloaded: ready to start': 'Scaricato: pronto per iniziare',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': "Ogni lingua nella sua scrittura: inglese in caratteri latini, hindi in devanagari. Scegli Hinglish per scrivere l'hindi in caratteri latini.",
  'First time only: downloads {size}, now downloading in the background': 'Solo la prima volta: scarica {size}, ora il download è in corso in background',
  'Getting the model ready: {loaded} of {total}': 'Preparazione del modello: {loaded} di {total}',
  'Good for most videos.': 'Adatto alla maggior parte dei video.',
  'Honest, dated comparisons with other transcription services.': 'Confronti onesti e datati con altri servizi di trascrizione.',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': "Tieni aperta questa pagina finché non è terminato. Se la pagina si ricarica o viene chiusa, l'operazione riprende da dove si era interrotta quando riapri il sito.",
  'Length {time}': 'Durata {time}',
  'Opens in Word and Google Docs': 'Si apre in Word e Google Docs',
  'Reconnecting…': 'Riconnessione…',
  'The download server is busy (HTTP {status}).': 'Il server di download è occupato (HTTP {status}).',
  'The download stalled.': 'Il download si è bloccato.',
  'Time so far {time}': 'Tempo trascorso {time}',
  'Translated to English': 'Tradotto in inglese',
  'Waiting for the internet connection…': 'In attesa della connessione a internet…',
  'Word document (.docx)': 'Documento Word (.docx)',
  'Transcribed in {time}': 'Trascritto in {time}',
  Transcript: 'Trascrizione',
  'Transcript name': 'Nome della trascrizione',
  'Transcript not found': 'Trascrizione non trovata',
  'Transcript ready': 'Trascrizione pronta',
  'Transcript style': 'Stile della trascrizione',
  'Transcription failed': 'Trascrizione non riuscita',
  'Transcription has started. The text appears below as it is recognised.':
    'La trascrizione è iniziata. Il testo appare qui sotto man mano che viene riconosciuto.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'La trascrizione è iniziata. Gli altri file sono in Trascrizioni, in alto nella pagina.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    "La trascrizione funziona sul tuo dispositivo e usa il suo processore, la scheda grafica, la memoria e la batteria. Non impostiamo alcun limite di dimensione o durata dei file, ma la velocità e la dimensione del file che il browser riesce a gestire dipendono dal dispositivo: un file lungo su un telefono o computer più lento può richiedere molto tempo o esaurire la memoria. Le tue trascrizioni e i tuoi file sono conservati in questo browser ed eliminati automaticamente dopo {idle} di inattività. Vedi l'[Informativa sulla privacy](/privacy).",
  'Transcription settings': 'Impostazioni di trascrizione',
  Transcripts: 'Trascrizioni',
  'Transcripts {n}': 'Trascrizioni {n}',
  'Transcripts are only kept for the browser session that created them.':
    'Le trascrizioni vengono conservate solo per la sessione del browser che le ha create.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    "Le trascrizioni sono prodotte automaticamente e conterranno errori, soprattutto con audio rumoroso, forti accenti, più persone che parlano insieme, musica, nomi o termini tecnici. Controlla sempre una trascrizione prima di farci affidamento, in particolare per usi legali, medici, finanziari o per la pubblicazione. Il servizio è fornito «così com'è» e «come disponibile», senza alcuna garanzia, esplicita o implicita, anche in merito a precisione, completezza o idoneità a uno scopo particolare.",
  'Translate to English': 'Traduci in inglese',
  'Try again': 'Riprova',
  'Try another quality or language': "Prova un'altra qualità o lingua",
  'try to spread malware or anything meant to damage the service.':
    'tentare di diffondere malware o qualsiasi cosa destinata a danneggiare il servizio.',
  'Trying again in a moment…': 'Nuovo tentativo tra un istante…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'Nuovo tentativo in corso. Questa pagina si carica da sola non appena il server torna disponibile.',
  'under a minute': 'meno di un minuto',
  'Underline unsure words': 'Sottolinea le parole incerte',
  Unlimited: 'Senza limiti',
  'Unsure: worth listening to again': 'Incerta: vale la pena riascoltarla',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    "A chi invia improvvisamente moltissimi file potrebbe essere chiesto di attendere un po'.",
  'Up to {minutes} per file.': 'Fino a {minutes} per file.',
  'Up to {size} and {minutes} minutes per file.': 'Fino a {size} e {minutes} minuti per file.',
  'Up to {size} and {minutes} per file.': 'Fino a {size} e {minutes} per file.',
  'Up to {size} per file.': 'Fino a {size} per file.',
  'Updated {date}': 'Aggiornato il {date}',
  'Upload complete': 'Caricamento completato',
  'Upload failed': 'Caricamento non riuscito',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'Caricamento non riuscito (errore del server {status}). Controlla il terminale su cui gira il server per i dettagli.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'Caricamento non riuscito (errore del server {status}). Riprova tra un momento.',
  Uploading: 'Caricamento',
  'Uploading…': 'Caricamento in corso…',
  'use a computer for this size': 'usa un computer per questa dimensione',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'usare script, bot o altri mezzi automatizzati contro il sito o il suo contatore, né inviare conteggi inventati, senza il nostro permesso scritto;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'usare il servizio su contenuti illegali o che violano i diritti di altri;',
  'use the service to harass, harm or deceive others;':
    'usare il servizio per molestare, danneggiare o ingannare altri;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'Di solito molto preciso con un parlato chiaro. Le righe di cui è incerto sono segnalate, così puoi controllarle per prime.',
  'Video and audio to text': 'Da video e audio a testo',
  'Video or audio, several at once is fine.': 'Video o audio, anche più file insieme.',
  'Video to text, accurately.': 'Da video a testo, con precisione.',
  'Video to text: transcribe a video or audio file':
    'Video in testo: trascrivi un file video o audio',
  'video transcribed': 'video trascritto',
  'videos transcribed': 'video trascritti',
  'Vocabulary hint': 'Suggerimento di vocabolario',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'Note vocali, riunioni, lezioni, podcast e interviste.',
  'Waiting for microphone permission…': "In attesa dell'autorizzazione al microfono…",
  'Waiting for the first words…': 'In attesa delle prime parole…',
  'Waiting in line…': 'In attesa in coda…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'Guarda il testo comparire in diretta, correggi gli eventuali errori, poi scaricalo come SRT, VTT, TXT, Markdown, JSON o PDF.',
  'We do not ask for your name, e-mail address or any other account details.':
    "Non ti chiediamo il nome, l'indirizzo e-mail né altri dati di un account.",
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'Non promettiamo che il servizio sia sempre disponibile, ininterrotto o privo di errori. Il sito, o i download di cui ha bisogno (i modelli vocali da Hugging Face e i file di programma da jsDelivr), possono non essere disponibili per manutenzione o per motivi indipendenti dalla nostra volontà, e alcuni browser o dispositivi non riescono a eseguire ogni modello. Poiché le tue trascrizioni sono conservate solo in questo browser ed eliminate dopo un periodo di inattività, esporta sempre ciò che ti serve.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'Non vendiamo i tuoi dati. Non conserviamo alcun tuo file né trascrizione, quindi non abbiamo nulla da condividere: il riconoscimento avviene sul tuo dispositivo, non su un servizio esterno di trascrizione o di IA. Google (pubblicità), Cloudflare (hosting e contatore), Hugging Face e jsDelivr (i download) ricevono solo quanto descritto sopra. Potremmo comunicare informazioni se la legge lo richiede.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    "Da parte nostra non conserviamo nulla di tuo: a parte l'unico totale, noi non memorizziamo nulla sul tuo utilizzo.",
  'We may block access if these rules are broken.':
    "Possiamo bloccare l'accesso se queste regole vengono violate.",
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'Possiamo aggiornare questi termini. La nuova versione compare in questa pagina con una nuova data di «Ultimo aggiornamento» e si applica da quel momento.',
  'We never send your file, your transcript or any personal information to Google.':
    'Non inviamo mai il tuo file, la tua trascrizione né alcuna informazione personale a Google.',
  'Web subtitles (.vtt)': 'Sottotitoli per il web (.vtt)',
  'What people use it for': 'A cosa serve alle persone',
  'What you can do with it': 'Cosa puoi farci',
  'What you get': 'Cosa ottieni',
  'what you were doing, and what happened instead of what you expected;':
    'cosa stavi facendo e cosa è successo invece di ciò che ti aspettavi;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    "Dove vengono elaborati i tuoi file dipende da come viene gestito {brand}, e il server non ha risposto proprio ora. Vedi l'[Informativa sulla privacy](/privacy).",
  'Where your files are processed depends on how {brand} is run.':
    'Dove vengono elaborati i tuoi file dipende da come viene gestito {brand}.',
  'Which files can I use, and what are the limits?':
    'Quali file posso usare e quali sono i limiti?',
  'Which languages are supported?': 'Quali lingue sono supportate?',
  'Who builds it': 'Chi lo realizza',
  'Who runs this website': 'Chi gestisce questo sito',
  'Why it exists': 'Perché esiste',
  'Working…': 'Elaborazione…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    "Sì. È gratuito e non c'è mai nessun account né accesso. Non ci sono quote giornaliere o mensili né paywall; gli annunci mantengono il sito gratuito.",
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    "Sì. È gratuito e non c'è mai nessun account né accesso. Non ci sono quote giornaliere o mensili né paywall.",
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    "Sì. È gratuito, non c'è niente a cui registrarsi e nessun accesso. Questa copia funziona sul tuo computer, quindi non ci sono quote né paywall; la velocità dipende dal tuo computer.",
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'Sì. Usa la matita accanto a una riga per cambiarne il testo o eliminarla, oppure cerca e sostituisci in tutta la trascrizione. Le tue modifiche sono incluse in ogni esportazione.',
  'You agree not to:': 'Ti impegni a non:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'Hai il controllo: elimina in qualsiasi momento le tue trascrizioni, i tuoi file e, se vuoi, i modelli vocali scaricati con **Elimina ora i miei dati**. Elimina solo i dati in questo browser; non può eliminare i cookie di Google.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'Puoi cambiarla in qualsiasi momento con **Impostazioni di privacy e cookie** in fondo a qualsiasi pagina che mostra annunci (ad esempio la home page).',
  'You can now read, fix and download it.': 'Ora puoi leggerla, correggerla e scaricarla.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'Puoi smettere di usare il servizio in qualsiasi momento ed eliminare i dati in questo browser con **Elimina ora i miei dati**. Possiamo sospendere o terminare il tuo accesso in qualsiasi momento, in particolare se violi questi termini.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'Conservi tutti i diritti sui file che aggiungi e sulle trascrizioni create da essi. Vengono elaborati sul tuo dispositivo e noi non li riceviamo mai. Sei responsabile di ciò che trascrivi: usa solo contenuti che possiedi o che hai il diritto di elaborare, compreso qualsiasi permesso necessario da parte delle persone che parlano nel contenuto.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    "Puoi disattivare la pubblicità personalizzata visitando le [Impostazioni annunci di Google](https://adssettings.google.com), oppure disattivare l'uso dei cookie per la pubblicità personalizzata da parte di alcuni fornitori terzi su [www.aboutads.info](https://www.aboutads.info). Scopri [come Google usa le informazioni dei siti che usano i suoi servizi](https://policies.google.com/technologies/partner-sites).",
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'il tuo browser e la sua versione, e il tuo dispositivo (computer o telefono, e il suo sistema operativo);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'Il browser ha bloccato la copia qui. Usa Esporta per salvare il testo.',
  'Your change is saved.': 'La tua modifica è stata salvata.',
  'Your change is still in its box: press Save to try again.':
    'La tua modifica è ancora nella sua casella: premi Salva per riprovare.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'Il tuo file viene inviato al server tramite una connessione cifrata, trascritto con modelli di riconoscimento vocale aperti come OpenAI Whisper ed eliminato automaticamente in seguito. La pagina [Come funziona](/how-it-works) spiega ogni passaggio.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'Il tuo file viene trascritto nel browser, sul tuo dispositivo, quindi non impostiamo alcun limite di dimensione o durata. Funzionano anche file molto grandi o lunghi: richiedono più tempo e abbastanza memoria libera, e la pagina ti avvisa quando il dispositivo potrebbe essere lento.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'Il tuo file viene trascritto con modelli di riconoscimento vocale aperti come OpenAI Whisper ed eliminato automaticamente in seguito.',
  'Your file never leaves your device.': 'Il tuo file non lascia mai il tuo dispositivo.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'Il tuo file non lascia mai il tuo dispositivo. [Privacy](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'Il tuo file non lascia mai il tuo dispositivo. Viene trascritto nel browser su questo dispositivo e non viene mai caricato da noi né da nessun altro. Trascrizioni, modifiche e file sono conservati solo nella memoria di questo browser ed eliminati automaticamente dopo {idle} di inattività, oppure subito quando premi **Elimina ora i miei dati** nel menu Trascrizioni. Non esiste alcun account. Esporta ciò che ti serve prima di andare via.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'Il tuo file non lascia mai il tuo dispositivo. Viene trascritto direttamente nel browser, senza account, e le tue trascrizioni restano in questo browser.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'Il tuo file resta su questo dispositivo. Tieni aperta questa scheda mentre viene trascritto.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'I tuoi file e le tue trascrizioni sono conservati solo per questa sessione ed eliminati automaticamente dopo {idle} di inattività, oppure quando premi «Elimina ora i miei dati». Nessun account, nessun tracciamento, un solo cookie di sessione essenziale. Esporta ciò che ti serve prima di andare via.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'I tuoi file e le tue trascrizioni sono conservati solo per questa sessione ed eliminati automaticamente quando termina, oppure quando premi «Elimina ora i miei dati». Nessun account, nessun tracciamento, un solo cookie di sessione essenziale. Esporta ciò che ti serve prima di andare via.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'I tuoi file vengono eliminati automaticamente. [Privacy](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'I tuoi file vengono elaborati nel browser e restano sul tuo dispositivo. Il sito, i download e il contatore usano connessioni cifrate (HTTPS). Chiunque possa usare questo profilo del browser può vedere le trascrizioni conservate al suo interno finché non vengono eliminate, quindi su un computer condiviso premi **Elimina ora i miei dati**.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    "I tuoi file vengono caricati sul nostro server per essere elaborati lì. Sono conservati solo per la tua sessione ed eliminati automaticamente quando termina, dopo {idle} di inattività, oppure subito quando premi **Elimina ora i miei dati** nel menu Trascrizioni. Non esiste alcun account né tracciamento, e l'unico cookie è un cookie di sessione essenziale (nessun cookie di analisi o pubblicitario).",
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    "I tuoi file vengono caricati sul nostro server per essere elaborati lì. Sono conservati solo per la tua sessione ed eliminati automaticamente quando termina, oppure subito quando premi **Elimina ora i miei dati** nel menu Trascrizioni. Non esiste alcun account né tracciamento, e l'unico cookie è un cookie di sessione essenziale (nessun cookie di analisi o pubblicitario).",
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'I tuoi file non lasciano mai questo dispositivo. Le trascrizioni sono conservate solo in questo browser ed eliminate automaticamente dopo {idle} di inattività, oppure quando premi «Elimina ora i miei dati». Esporta ciò che ti serve prima di andare via.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'I tuoi file non lasciano mai questo dispositivo. Le trascrizioni sono conservate solo in questo browser ed eliminate automaticamente quando la sessione termina, oppure quando premi «Elimina ora i miei dati». Esporta ciò che ti serve prima di andare via.',
  'Your session ends in {mins} min. Export what you need.':
    'La tua sessione termina tra {mins} min. Esporta ciò che ti serve.',
  'Your session has ended': 'La tua sessione è terminata',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'La tua sessione è terminata e i suoi dati sono stati eliminati. Puoi avviare una nuova trascrizione.',
  'Your transcript is ready below.': 'La tua trascrizione è pronta qui sotto.',
  'Your transcripts': 'Le tue trascrizioni',
  'Your transcripts and files were removed from the server.':
    'Le tue trascrizioni e i tuoi file sono stati rimossi dal server.',
  'Your transcripts and files were removed from this device.':
    'Le tue trascrizioni e i tuoi file sono stati rimossi da questo dispositivo.',

  // page titles, descriptions and link labels
  'title:/': 'Video e audio in testo, gratis e senza login',
  'description:/':
    'Trascrizione gratuita da video e audio in testo. Senza registrazione né limiti giornalieri, oltre 50 lingue. Esporta in SRT, VTT, TXT e PDF.',
  'title:/how-it-works': 'Come funziona',
  'description:/how-it-works':
    'Come TranscribeVid trasforma video e audio in testo accurato con timestamp in tre passaggi, cosa ottieni e consigli per i risultati migliori.',
  'title:/faq': 'Domande frequenti',
  'description:/faq':
    'Risposte alle domande più comuni su TranscribeVid: precisione, lingue, file supportati e limiti, velocità, privacy e modifica del testo della trascrizione.',
  'title:/about': 'Informazioni su TranscribeVid',
  'description:/about':
    'Chi realizza TranscribeVid e perché: uno strumento gratuito da video e audio a testo, senza registrazione né accesso, finanziato dagli annunci.',
  'title:/contact': 'Contatti',
  'description:/contact':
    'Come contattare TranscribeVid: e-mail per domande, segnalazioni di errori, idee per nuove funzioni e richieste sulla privacy, e chi gestisce il sito web.',
  'title:/privacy': 'Informativa sulla privacy',
  'description:/privacy':
    'Cosa tratta TranscribeVid quando trascrivi un file, dove, perché e per quanto tempo lo conserva, cookie, annunci, memoria del browser e i tuoi diritti.',
  'title:/terms': 'Termini di utilizzo',
  'description:/terms':
    'Le regole per usare TranscribeVid: servizio gratuito, i tuoi contenuti, uso consentito, limiti dei file, nessuna garanzia sulla precisione, responsabilità.',
  'title:/tools': 'Tutti gli strumenti gratuiti',
  'description:/tools':
    'Tutti gli strumenti gratuiti da video e audio a testo in un elenco: per tipo di file, per uso, sottotitoli e lingue. Senza registrazione, oltre 50 lingue.',
  'title:/guides': 'Guide: trascrizioni e sottotitoli',
  'description:/guides':
    'Guide pratiche su trascrizioni e sottotitoli: SRT o VTT, come aggiungere sottotitoli a un video, come ottenere una trascrizione accurata e privata.',
  'title:/video-to-text': 'Video in testo: convertitore gratuito',
  'description:/video-to-text':
    'Converti un video in testo gratis. Trascrizione accurata con timestamp in oltre 50 lingue, senza registrazione né limiti. Scarica SRT, VTT, TXT o PDF.',
  'label:/video-to-text': 'Video in testo',
  'title:/audio-to-text': 'Audio in testo: convertitore gratuito',
  'description:/audio-to-text':
    'Trasforma podcast, interviste e lezioni in testo. Da audio a testo gratis, con timestamp, oltre 50 lingue, senza registrazione. Scarica TXT, SRT o PDF.',
  'label:/audio-to-text': 'Audio in testo',
  'title:/mp4-to-text': 'MP4 in testo: trascrivi video MP4 gratis',
  'description:/mp4-to-text':
    'Converti un video MP4 in testo con i timestamp. Gratis, senza registrazione né limiti, oltre 50 lingue. Scarica TXT, SRT, VTT, Markdown, JSON o PDF.',
  'label:/mp4-to-text': 'MP4 in testo',
  'title:/mp3-to-text': 'MP3 in testo: trascrizioni gratuite',
  'description:/mp3-to-text':
    'Trascrivi un MP3 in testo online gratis. Senza registrazione, oltre 50 lingue, un timestamp su ogni riga. Modifica il testo e scarica TXT, SRT, VTT o PDF.',
  'label:/mp3-to-text': 'MP3 in testo',
  'title:/srt-subtitle-generator': 'Generatore di sottotitoli SRT gratuito',
  'description:/srt-subtitle-generator':
    'Genera un file di sottotitoli SRT da qualsiasi video o audio, gratis. Sincronizzato con il parlato, oltre 50 lingue. Modifica le righe e scarica SRT o VTT.',
  'label:/srt-subtitle-generator': 'Generatore di sottotitoli SRT',
  'title:/voice-recording-to-text': 'Registrazione vocale in testo, gratis',
  'description:/voice-recording-to-text':
    'Registra la voce nel browser o carica una nota vocale e ottienila come testo. Gratis, senza registrazione, oltre 50 lingue. Scarica TXT, PDF o SRT.',
  'label:/voice-recording-to-text': 'Registrazione vocale in testo',
  'title:/wav-to-text': 'WAV in testo: trascrizione online gratuita',
  'description:/wav-to-text':
    'Converti un file WAV in testo gratis. Gestisce registrazioni lunghe di registratori e chiamate, oltre 50 lingue, timestamp. Scarica TXT, SRT o PDF.',
  'label:/wav-to-text': 'WAV in testo',
  'title:/m4a-to-text': 'M4A in testo: trascrivi note vocali',
  'description:/m4a-to-text':
    'Trasforma una nota vocale o una registrazione M4A in testo, gratis. Funziona con le Note vocali di iPhone, oltre 50 lingue. Scarica TXT, SRT, VTT o PDF.',
  'label:/m4a-to-text': 'M4A in testo',
  'title:/webm-to-text': 'WebM in testo: trascrizione gratuita',
  'description:/webm-to-text':
    'Converti un file video o audio WebM in testo, gratis. Funziona con registrazioni dello schermo e del browser, oltre 50 lingue. Scarica TXT, SRT, VTT o PDF.',
  'label:/webm-to-text': 'WebM in testo',
  'title:/mov-to-text': 'MOV in testo: trascrivi video iPhone',
  'description:/mov-to-text':
    'Trascrivi un video MOV da iPhone o QuickTime gratis. Senza registrazione, oltre 50 lingue, un timestamp su ogni riga. Scarica TXT, SRT, VTT o PDF.',
  'label:/mov-to-text': 'MOV in testo',
  'title:/whatsapp-voice-message-to-text': 'Vocale WhatsApp in testo, gratis',
  'description:/whatsapp-voice-message-to-text':
    'Trasforma un messaggio vocale di WhatsApp in testo, gratis. Salvala, trascinala qui e leggila in oltre 50 lingue, hindi compreso. Senza account.',
  'label:/whatsapp-voice-message-to-text': 'Vocale WhatsApp in testo',
  'title:/meeting-recording-to-text': 'Riunioni Zoom, Teams e Meet in testo',
  'description:/meeting-recording-to-text':
    'Trasforma la registrazione di una riunione Zoom, Teams o Meet in una trascrizione con timestamp, gratis. Senza registrazione, oltre 50 lingue.',
  'label:/meeting-recording-to-text': 'Registrazione di riunioni in testo',
  'title:/lecture-to-text': 'Lezione in testo: trascrittore gratuito',
  'description:/lecture-to-text':
    'Trasforma una lezione registrata in una trascrizione da cercare e studiare. Gratis, senza registrazione, oltre 50 lingue. Scarica TXT, Markdown, SRT o PDF.',
  'label:/lecture-to-text': 'Lezione in testo',
  'title:/podcast-transcript-generator': 'Generatore di trascrizioni per podcast',
  'description:/podcast-transcript-generator':
    'Genera la trascrizione di un podcast da un file MP3 o WAV, gratis. Timestamp, oltre 50 lingue, senza registrazione. Scarica TXT, Markdown, SRT, VTT o PDF.',
  'label:/podcast-transcript-generator': 'Generatore di trascrizioni per podcast',
  'title:/interview-transcription': 'Trascrizione di interviste, privata e gratis',
  'description:/interview-transcription':
    'Trascrivi interviste gratis, senza creare un account. Testo con timestamp in oltre 50 lingue, per ricerca, giornalismo e selezione del personale.',
  'label:/interview-transcription': 'Trascrizione di interviste',
  'title:/vtt-subtitle-generator': 'Generatore di sottotitoli VTT (WebVTT)',
  'description:/vtt-subtitle-generator':
    'Genera un file di sottotitoli WebVTT (.vtt) da qualsiasi video o audio, gratis. Sincronizzato con il parlato, oltre 50 lingue. Modifica e scarica VTT.',
  'label:/vtt-subtitle-generator': 'Generatore di sottotitoli VTT',
  'title:/youtube-subtitle-generator': 'Sottotitoli per YouTube: file SRT gratis',
  'description:/youtube-subtitle-generator':
    'Crea un file SRT di sottotitoli per il tuo video di YouTube, gratis e senza accedere. Oltre 50 lingue. Caricalo in YouTube Studio.',
  'label:/youtube-subtitle-generator': 'Generatore di sottotitoli per YouTube',
  'title:/translate-audio-to-english': 'Traduci il parlato in testo inglese',
  'description:/translate-audio-to-english':
    "Trasforma il parlato in un'altra lingua in testo inglese, gratis. Carica un video o un audio e ottieni testo o sottotitoli in inglese. Senza registrazione.",
  'label:/translate-audio-to-english': 'Traduci il parlato in inglese',
  'title:/guides/srt-vs-vtt': 'SRT o VTT: quale formato di sottotitoli',
  'description:/guides/srt-vs-vtt':
    'SRT o VTT? Cosa sono i due formati di sottotitoli, come differiscono, dove funziona ciascuno e come ottenere il file dal tuo video gratis.',
  'label:/guides/srt-vs-vtt': 'SRT o VTT',
  'title:/guides/how-to-add-subtitles-to-a-video': 'Come aggiungere sottotitoli a un video',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'Crea i sottotitoli in quattro passaggi: trascrivi il video, correggi il testo, esporta SRT o VTT, poi aggiungi il file a YouTube, VLC, un editor o al web.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'Come aggiungere sottotitoli a un video',
  'title:/guides/transcribe-video-without-uploading': 'Trascrivere un video senza caricarlo',
  'description:/guides/transcribe-video-without-uploading':
    'Come funziona la trascrizione nel browser, cosa resta sul tuo dispositivo, cosa si scarica una volta sola e come verificarlo nel pannello di rete.',
  'label:/guides/transcribe-video-without-uploading': 'Trascrivere un video senza caricarlo',
  'title:/guides/accurate-transcripts': 'Come ottenere una trascrizione accurata',
  'description:/guides/accurate-transcripts':
    'Modi pratici per migliorare la precisione: audio più pulito, lingua e modello giusti, un suggerimento di vocabolario e il controllo del risultato.',
  'label:/guides/accurate-transcripts': 'Come ottenere una trascrizione più accurata',
  'title:/guides/what-is-whisper': "Cos'è Whisper? Riconoscimento vocale",
  'description:/guides/what-is-whisper':
    "Cos'è OpenAI Whisper, con cosa è stato addestrato, quanto è preciso e dove fatica, e come funziona nel tuo browser su TranscribeVid.",
  'label:/guides/what-is-whisper': "Cos'è Whisper?",
  'an independent software developer': 'uno sviluppatore software indipendente',
  'Bengaluru, India': 'Bengaluru, India',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    "Questa pagina è stata tradotta con l'IA. [Hai trovato un errore? Dicci dove.](/contact)",
  'A finished transcript: a media player next to the text in short lines, each with a timestamp.':
    'Una trascrizione terminata: un lettore accanto al testo in righe brevi, ciascuna con il suo timestamp.',
  'A finished transcript. Every line has a timestamp, and Export saves it as SRT, VTT, TXT, PDF and more.':
    'Una trascrizione terminata. Ogni riga ha il suo timestamp, ed Esporta la salva come SRT, VTT, TXT, PDF e altro.',
};
export default dict;
