import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Come trascrivere un video senza caricarlo',
  lead: 'Su transcribevid.com il riconoscimento vocale gira dentro il tuo browser, quindi il tuo file video o audio viene letto sul tuo dispositivo e non viene inviato al sito, a Google né a nessun altro. Questa guida spiega come funziona, cosa scarica comunque il tuo browser, cosa viene comunque inviato e come puoi verificare tutto da solo.',
  readingMinutes: 10,
  toolPath: '/video-to-text',
  toolCta: 'Trascrivi un video sul tuo dispositivo',
  blocks: [
    {
      title: 'Cosa significa qui «senza caricare»',
      paragraphs: [
        'La maggior parte dei servizi di trascrizione online funziona allo stesso modo: invii il file al loro server, un computer che non vedi lo trascrive e scarichi il risultato. La tua registrazione resta sulla macchina di qualcun altro per tutto il tempo che la conservano.',
        'Su transcribevid.com il lavoro avviene al contrario. Il programma di riconoscimento vocale arriva al tuo browser, e il tuo browser lo esegue sul tuo computer o telefono. Il file multimediale viene letto dal tuo disco dalla pagina che hai aperta. Non viene mai allegato a una richiesta al sito e non viene mai inviato a Google, alle aziende che ospitano i download né a un servizio vocale.',
        "È per questo che il sito non fissa limiti di dimensione o di durata e non ha code: non c'è un nostro server che fa il lavoro, quindi nulla fa crescere un conto per ogni file, e nessuno aspetta davanti a te. Una registrazione molto lunga richiede comunque tempo e memoria libera sul tuo dispositivo. È anche per questo che un'intervista riservata o un video di famiglia privato può essere trascritto senza uscire dal tuo dispositivo.",
        'Questa guida descrive il sito web transcribevid.com. Una copia del software che qualcuno installa sul proprio server funziona in modo diverso: invia il file a quel server con una connessione cifrata e lo elimina automaticamente in seguito.',
      ],
    },
    {
      title: 'Come funziona, passo per passo',
      steps: [
        {
          title: 'La pagina si carica',
          text: 'Il tuo browser scarica la pagina e il suo codice da transcribevid.com, che è ospitato su Cloudflare. È come aprire qualsiasi altro sito web.',
        },
        {
          title: 'Il modello vocale viene scaricato una volta',
          text: 'La prima volta che usi un livello di qualità, il tuo browser scarica da Hugging Face il modello di riconoscimento vocale corrispondente, insieme ai file del motore che lo esegue da jsDelivr. Vengono conservati nella cache del tuo browser, quindi la trascrizione successiva parte senza scaricarli di nuovo.',
        },
        {
          title: 'Il tuo file viene decodificato sul tuo dispositivo',
          text: "I decodificatori audio e video integrati nel browser trasformano il file in suono semplice mono a 16 kHz, che è ciò che legge il modello. Per alcuni formati che il browser non riesce ad aprire da solo, come AVI, WMA e FLV, la pagina chiede prima il permesso e poi scarica un convertitore di circa 9 MB, che gira anch'esso sul tuo dispositivo.",
        },
        {
          title: 'Un worker esegue il modello',
          text: 'Un thread in background della pagina, chiamato Web Worker, esegue il modello così che la pagina resti reattiva. Usa il tuo chip grafico tramite WebGPU quando il browser lo supporta, e altrimenti il tuo processore tramite WebAssembly.',
        },
        {
          title: 'Il testo compare e resta nel tuo browser',
          text: 'La trascrizione viene costruita riga per riga con i timestamp. È conservata nella memoria del tuo browser per la sessione, e anche i file SRT, VTT, TXT, Markdown, JSON e PDF che scarichi vengono creati sul tuo dispositivo.',
        },
      ],
    },
    {
      title: 'Cosa scarica il tuo browser',
      paragraphs: [
        'Non caricare non significa non scaricare. Un modello vocale è un file grande, e il tuo browser deve scaricarlo prima di poter trascrivere qualcosa. Ecco cosa arriva, e da dove.',
      ],
      table: {
        caption: 'Cosa scarica la pagina, da dove e quando',
        head: ['Cosa', 'Da dove', 'Quando', 'Dimensione indicativa'],
        rows: [
          [
            'La pagina e il suo codice',
            'transcribevid.com (Cloudflare)',
            'A ogni visita, poi in cache',
            'Circa 200 KB',
          ],
          [
            'Il codice del motore che esegue il modello',
            'transcribevid.com',
            'Alla prima trascrizione, poi in cache',
            'Meno di 1 MB',
          ],
          [
            'Il runtime del modello (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Alla prima trascrizione, poi in cache',
            'Da circa 17 a 27 MB',
          ],
          [
            'Un piccolo modello di rilevamento del parlato',
            'transcribevid.com',
            'Alla prima trascrizione, poi in cache',
            'Circa 1,2 MB',
          ],
          [
            'Il modello vocale per la tua scelta di qualità',
            'huggingface.co (Hugging Face)',
            'Una volta per scelta di qualità, poi in cache',
            'Da circa 40 MB a qualche GB (vedi sotto)',
          ],
          [
            'Un convertitore per i formati che il browser non riesce ad aprire (AVI, WMA, FLV e simili)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Solo se il tuo file ne ha bisogno, e solo dopo il tuo consenso',
            'Circa 9 MB',
          ],
          [
            "Il modello di scrittura dell'hindi (IndicXlit)",
            'transcribevid.com',
            "Solo quando l'hindi è scritto in lettere latine (Hinglish), poi in cache",
            'Circa 13 MB',
          ],
        ],
      },
      after: [
        'Questi download sono file di programma e di modello, non i tuoi dati. Le aziende che li consegnano vedono i dettagli abituali di qualsiasi richiesta web, come il tuo indirizzo internet e il browser, ma mai i tuoi contenuti multimediali né la tua trascrizione.',
      ],
    },
    {
      title: 'Cosa viene comunque inviato, onestamente',
      paragraphs: ['Tre cose raggiungono un server, e nessuna è il tuo file o il tuo testo.'],
      bullets: [
        {
          title: "L'hosting.",
          text: 'Cloudflare consegna il sito web, quindi elabora il tuo indirizzo internet e i dettagli abituali della richiesta per consegnare e proteggere il sito.',
        },
        {
          title: 'Un totale progressivo.',
          text: "Quando una trascrizione finisce, il tuo browser invia una richiesta vuota al contatore del sito, che aggiunge uno al numero mostrato nell'intestazione. Non contiene alcun file, alcuna trascrizione né alcun identificativo. Il contatore è riportato dai browser dei visitatori e non è verificato in modo indipendente.",
        },
        {
          title: 'La pubblicità.',
          text: 'Il sito è gratuito perché mostra annunci pubblicati da Google AdSense, nelle pagine informative, mai mentre un file viene trascritto né accanto alla tua trascrizione. Google usa i cookie per gli annunci e, dove la legge lo richiede, chiede prima il tuo consenso. Gli script pubblicitari di Google fanno richieste proprie a Google, ma il tuo file e la tua trascrizione non vengono mai inviati a Google.',
        },
      ],
      after: [
        "L'informativa sulla privacy espone tutto questo per intero. Non c'è alcun account e il sito non chiede nome né indirizzo e-mail.",
      ],
    },
    {
      title: 'Come verificarlo da solo',
      paragraphs: [
        'Non devi crederci sulla parola. Ogni browser moderno può mostrarti cosa una pagina invia e riceve, e il controllo richiede due minuti.',
      ],
      steps: [
        {
          title: 'Apri gli strumenti per sviluppatori',
          text: 'In Chrome, Edge o Firefox, apri la home page di transcribevid.com e premi F12 (su un Mac, Comando, Opzione e I). Scegli la scheda Rete (Network).',
        },
        {
          title: "Svuota l'elenco",
          text: 'Premi il pulsante di cancellazione, che sembra un cerchio con una linea che lo attraversa, così compaiono solo le nuove richieste.',
        },
        {
          title: 'Avvia una trascrizione',
          text: 'Aggiungi un file e premi Trascrivi. Tieni visibile la scheda Rete.',
        },
        {
          title: 'Guarda cosa arriva',
          text: 'La prima volta vedrai grandi download da huggingface.co e cdn.jsdelivr.net. Sono il modello e il motore che arrivano.',
        },
        {
          title: 'Cerca ciò che esce',
          text: "Scrivi method:POST nella casella del filtro (Chrome ed Edge; Firefox accetta lo stesso filtro). L'unica richiesta POST a transcribevid.com dovrebbe essere una richiesta vuota a /api/count dopo la fine della trascrizione. Aprila e controlla il suo corpo: è vuoto. Se la pagina mostra annunci, gli script di Google fanno richieste proprie a Google, e nessuna porta il tuo file o la tua trascrizione. Nulla di vicino alla dimensione del tuo file lascia il tuo dispositivo.",
        },
      ],
    },
    {
      title: 'Quanto è grande il primo download, e quanto è veloce?',
      paragraphs: [
        'La dimensione dipende dal livello di qualità e dal tipo di dispositivo. Un dispositivo con WebGPU riceve una versione compatta per la sua dimensione, mentre un dispositivo che usa WebAssembly ne riceve una diversa. La pagina ti dice la dimensione esatta del download prima di iniziare, così non hai mai sorprese. Queste sono le dimensioni approssimative dei file del modello (le cifre WebGPU valgono per i browser con supporto degli shader a 16 bit; gli altri dispositivi ricevono altre versioni):',
      ],
      table: {
        caption: 'Download approssimativo del modello al primo uso',
        head: ['Scelta di qualità', 'Modello Whisper', 'Con WebGPU', 'Con WebAssembly'],
        rows: [
          ['Più veloce', 'Base', 'Circa 146 MB', 'Circa 77 MB'],
          ['Standard', 'Small', 'Circa 485 MB', 'Circa 249 MB'],
          ['Alta precisione', 'Large v3 Turbo', 'Circa 564 MB', 'Circa 1,1 GB'],
          [
            'Massima precisione',
            'Large v3',
            'Circa 980 MB, più circa 564 MB per i tempi per parola',
            'Circa 1,8 GB, più circa 1,1 GB per i tempi per parola',
          ],
        ],
      },
      after: [
        "Aggiungi qualche megabyte per i file di configurazione del modello. Large v3 non ha una versione propria per i tempi per parola, quindi con Tempi per parola attivo, che è l'impostazione predefinita, la sua prima esecuzione scarica anche il modello di temporizzazione Large v3 Turbo, e la pagina lo dice prima che tu inizi. Quel modello Turbo viene conservato ed è condiviso con la scelta Alta precisione. Dopo il primo download il modello viene letto dalla cache del tuo browser, quindi le trascrizioni successive partono subito. La velocità, poi, dipende interamente dal tuo dispositivo: un computer con un chip grafico capace e WebGPU è molto più veloce di un telefono o di un portatile più vecchio che usa WebAssembly.",
      ],
    },
    {
      title: 'Quando questo è lo strumento giusto, e quando no',
      paragraphs: [
        'Trascrivere sul proprio dispositivo è adatto al materiale privato e ai file lunghi. Non è lo strumento migliore per tutto.',
      ],
      bullets: [
        {
          title: 'Ottimo per le registrazioni riservate.',
          text: 'Su transcribevid.com, interviste, riunioni, appunti medici o legali e video personali restano sul tuo dispositivo.',
        },
        {
          title: 'Ottimo per i file lunghi.',
          text: "Su transcribevid.com non c'è alcun caricamento da attendere e non è fissato alcun limite di dimensione o di durata. Una registrazione molto lunga richiede tempo e memoria libera, e un browser senza supporto di WebCodecs può rifiutare un file molto lungo.",
        },
        {
          title: 'Non per le didascalie in diretta.',
          text: 'La trascrizione viene creata da un file o da una registrazione finita. Non sottotitola un evento dal vivo mentre accade.',
        },
        {
          title: 'Non per i nomi dei parlanti.',
          text: 'Le righe hanno i timestamp, ma il testo non dice chi sta parlando. Puoi scrivere i nomi mentre modifichi.',
        },
        {
          title: 'Non ideale su un telefono debole.',
          text: 'I telefoni hanno meno memoria. La pagina ti avvisa, e può disattivare le scelte di qualità più grandi, quando il tuo dispositivo non può eseguirle. Taglia le registrazioni molto lunghe in parti.',
        },
        {
          title: 'Non se non puoi scaricare un file grande una volta.',
          text: 'Il primo uso richiede una connessione in grado di scaricare decine o centinaia di megabyte.',
        },
      ],
    },
    {
      title: 'Cancellare i tuoi dati in seguito',
      paragraphs: [
        'Su transcribevid.com, le tue trascrizioni e il file di origine sono conservati nella memoria del tuo browser, così che la pagina possa mostrarli e permetterti di modificarli ed esportarli. Vengono eliminati automaticamente quando la sessione termina dopo un periodo di inattività, o subito quando premi Elimina ora i miei dati nel menu Trascrizioni. I dati eliminati non si possono recuperare, quindi esporta prima ciò che ti serve.',
        'I modelli vocali restano nella cache del tuo browser così che le trascrizioni successive siano rapide, finché non li elimini (Elimina ora i miei dati può rimuovere anche quelli) o il browser non svuota la propria memoria. Se usi un computer condiviso o pubblico, premi Elimina ora i miei dati prima di andare via, perché chiunque possa aprire quel profilo del browser può leggere ciò che vi è conservato.',
      ],
    },
  ],
  faqs: [
    {
      question: 'È proprio vero che il mio file non viene mai caricato?',
      answer:
        "Sì, su transcribevid.com. Il riconoscimento gira nel tuo browser, e il tuo file viene letto dal tuo disco dalla pagina. Puoi confermarlo nella scheda Rete degli strumenti per sviluppatori del browser: l'unica richiesta che invia qualcosa a transcribevid.com è una richiesta di conteggio vuota dopo la fine della trascrizione, e gli script pubblicitari di Google fanno richieste proprie a Google che non portano mai il tuo file.",
    },
    {
      question: 'La trascrizione funziona ancora se la mia connessione è lenta?',
      answer:
        'La parte lenta è il primo download del modello vocale, che può essere di centinaia di megabyte. Una volta salvato nel tuo browser, la trascrizione vera e propria usa il tuo dispositivo e non richiede alcuna velocità di rete.',
    },
    {
      question: 'Perché il mio browser scarica un modello da un altro sito?',
      answer:
        'Il modello è il programma che riconosce il parlato, ed è troppo grande per essere incluso nella pagina. Viene scaricato da Hugging Face, un host pubblico per questi modelli, e il motore che lo esegue arriva da jsDelivr. Nessuno dei due riceve i tuoi contenuti multimediali né la tua trascrizione.',
    },
    {
      question: 'Trascrivere sul mio dispositivo è più veloce che caricare?',
      answer:
        "Può esserlo, perché non c'è caricamento né coda, e un computer con WebGPU è rapido. Su un portatile più vecchio o su un telefono lo stesso lavoro può richiedere più tempo di quanto ne impiegherebbe un server veloce. La prima esecuzione include anche il download una tantum del modello.",
    },
  ],
  links: [
    {
      label: 'Trascrizione di interviste',
      path: '/interview-transcription',
      note: 'Il percorso privato per interviste di ricerca, giornalistiche e di selezione.',
    },
    {
      label: "Cos'è Whisper?",
      path: '/guides/what-is-whisper',
      note: 'Il modello vocale che il tuo browser esegue, spiegato in parole semplici.',
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Impostazioni e abitudini che danno testo migliore, qualunque sia il dispositivo.',
    },
    {
      label: 'Video in testo',
      path: '/video-to-text',
      note: 'Aggiungi un video e guardalo diventare testo con timestamp sul tuo dispositivo.',
    },
    {
      label: 'Registrazioni di riunioni in testo',
      path: '/meeting-recording-to-text',
      note: 'Trasforma una registrazione salvata di Zoom, Teams o Meet in una trascrizione ricercabile.',
    },
  ],
};
