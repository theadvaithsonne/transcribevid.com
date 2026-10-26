import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Vocale WhatsApp in testo',
  h1: 'Converti un messaggio vocale WhatsApp in testo',
  lead: 'I messaggi vocali lunghi sono facili da inviare e difficili da rileggere. Salva il messaggio come file, trascinalo qui e leggilo come testo con timestamp, in hindi, inglese, spagnolo e molte altre lingue. Gratis, senza registrazione.',
  dropKind: 'audio',
  dropNoun: 'il tuo messaggio vocale WhatsApp',

  whyTitle: 'Perché trasformare un messaggio vocale in testo',
  why: [
    'Un messaggio vocale si registra in fretta e si usa lentamente. Non puoi cercarlo, copiarne una frase o scorrerlo in una riunione. Come testo, lo stesso messaggio si scorre in pochi secondi, e puoi incollare un indirizzo, una citazione o un elenco di istruzioni direttamente in una chat, in una nota o in un documento.',
    'Usa questa pagina per messaggi che hai inviato o ricevuto e che sei libero di usare. I messaggi vocali sono personali, quindi aiuta sapere dove va il file: qui viaggia fino al server con una connessione cifrata e viene rimosso automaticamente in seguito. Non serve alcun account.',
  ],
  browserWhy: [
    'Un messaggio vocale si registra in fretta e si usa lentamente. Non puoi cercarlo, copiarne una frase o scorrerlo in una riunione. Come testo, lo stesso messaggio si scorre in pochi secondi, e puoi incollare un indirizzo, una citazione o un elenco di istruzioni direttamente in una chat, in una nota o in un documento.',
    'Usa questa pagina per messaggi che hai inviato o ricevuto e che sei libero di usare. I messaggi vocali sono personali, quindi il file resta con te: il browser lo trascrive sul tuo dispositivo e non viene caricato nulla. La prima volta che usi il sito, il browser scarica il modello vocale una sola volta e lo conserva. Sono decine di megabyte per Più veloce, alcune centinaia per Standard e di più per le scelte più grandi, quindi su un telefono usa il Wi-Fi invece dei dati mobili. Non serve alcun account.',
  ],

  sections: [
    {
      title: 'Come salvare un messaggio vocale come file',
      paragraphs: [
        "WhatsApp conserva i messaggi vocali all'interno dell'app, quindi salva prima il messaggio come file. I menu cambiano tra modelli di telefono e versioni dell'app, quindi considera questi passaggi una guida e cerca le opzioni Condividi, Inoltra o Salva. WhatsApp appartiene alla propria azienda e questo sito non è collegato a essa.",
        'Su alcuni telefoni WhatsApp può anche mostrare una trascrizione dentro la chat, nelle lingue e nelle versioni che la offrono. Questa pagina serve quando vuoi il testo come file che puoi modificare ed esportare, con i timestamp, o quando la tua versione o la tua lingua non è coperta.',
      ],
      bullets: [
        {
          title: 'Su Android.',
          text: "Tieni premuto il messaggio vocale, apri il menu e cerca Condividi, oppure Inoltra e poi Condividi. Scegli Salva sul dispositivo, File o un'app di cloud, oppure invialo a te stesso via e-mail. Molti telefoni Android conservano anche i vocali ricevuti in una cartella WhatsApp Voice Notes che un gestore di file può aprire.",
        },
        {
          title: 'Su iPhone.',
          text: "Tieni premuto il messaggio vocale, scegli Inoltra, poi tocca l'icona di condivisione e scegli Salva su File. Puoi anche inviarlo al computer con AirDrop o via e-mail.",
        },
        {
          title: 'Su un computer.',
          text: "In WhatsApp Web o nell'app desktop, il menu del messaggio può offrire un'opzione Scarica. Se non c'è, salva il file sul telefono e trasferiscilo.",
        },
      ],
    },
    {
      title: 'Hindi, Hinglish e messaggi in più lingue',
      paragraphs: [
        'I messaggi vocali spesso mescolano le lingue nella stessa frase. Imposta la lingua su quella parlata soprattutto, oppure lascia Rileva automaticamente. Il riconoscimento segue meglio la lingua principale, quindi controlla le righe segnalate come incerte dove entra una seconda lingua.',
        "Per l'hindi, Stile della trascrizione decide come viene scritto il testo. Hinglish (hindi in caratteri latini) scrive l'hindi in lettere latine e lascia le parole inglesi così come sono. Scrittura originale mantiene il devanagari. Urdu, bengalese, arabo, spagnolo, portoghese e le altre lingue supportate mantengono la propria scrittura. Un messaggio in un'altra lingua può anche uscire come testo inglese: in Altre opzioni, imposta Risultato su Traduci in inglese, e confronta il risultato con la registrazione, perché la traduzione è meno affidabile della trascrizione nella lingua originale.",
      ],
    },
  ],

  howTitle: 'Come convertire un messaggio vocale WhatsApp in testo',
  howToDescription:
    'Salva il messaggio vocale come file, aggiungilo alla pagina, scegli la lingua, attendi la trascrizione e copia o scarica il testo.',
  steps: [
    {
      title: 'Aggiungi il file del messaggio vocale',
      text: "Trascina il file salvato sul riquadro qui sopra, oppure premi Scegli un file. Un messaggio vocale WhatsApp è di solito un file .opus, e funziona così com'è. Il riquadro accetta un file alla volta: passa il messaggio al caricatore nella pagina successiva, dove Aggiungi un altro file ti permette di includere altri messaggi.",
    },
    {
      title: 'Scegli la lingua',
      text: "Nella pagina successiva scegli la lingua parlata soprattutto, oppure lascia Rileva automaticamente. Per l'hindi, Stile della trascrizione sceglie tra caratteri latini (Hinglish) e devanagari. Poi premi Trascrivi.",
    },
    {
      title: 'Attendi il testo',
      text: 'Le righe compaiono con i loro timestamp mentre il messaggio viene elaborato, e un messaggio breve finisce prima di uno lungo. Standard va bene per la maggior parte dei messaggi. Per chi parla veloce o per una registrazione rumorosa, Alta precisione può aiutare dove il tuo dispositivo riesce a eseguirla. Su un dispositivo che non può, la scelta è disattivata con un motivo, e richiede un download iniziale più grande.',
    },
    {
      title: 'Controlla, copia o scarica',
      text: 'Correggi nomi e parole poco chiare, poi copia il testo oppure scarica il TXT. Scarica SRT o VTT solo se il messaggio fa parte di un video.',
    },
  ],

  formatsTitle: 'File dei messaggi vocali e download',
  formatsIntro:
    "I messaggi vocali WhatsApp sono di solito file .opus. Gli altri file audio funzionano allo stesso modo, e sono accettati anche i file video, con l'uso del solo audio.",
  uploadTitle: 'File audio che puoi aggiungere',
  accepts: ['OPUS', 'OGG', 'M4A', 'MP3', 'AAC', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'il messaggio come testo semplice da copiare' },
    { name: 'Markdown', use: 'appunti con un orario su ogni riga' },
    { name: 'PDF', use: 'una copia stampabile del messaggio' },
    { name: 'SRT', use: 'righe temporizzate per un video che contiene il messaggio' },
  ],

  tipsTitle: 'Consigli per i messaggi vocali',
  tips: [
    {
      title: 'Salva il file, non registrarlo di nuovo.',
      text: "Riprodurre un messaggio dall'altoparlante mentre un altro dispositivo registra aggiunge eco e rumore della stanza. Il file salvato è la copia pulita.",
    },
    {
      title: 'Indica la lingua principale.',
      text: "Scegliere la lingua è più affidabile del riconoscimento automatico per un messaggio breve, soprattutto quando chi parla passa da una lingua all'altra.",
    },
    {
      title: 'Aggiungi i nomi al suggerimento di vocabolario.',
      text: 'In Altre opzioni, scrivi i nomi di persone, luoghi e negozi citati. Sarà più probabile che vengano scritti come ti aspetti.',
    },
    {
      title: 'Controlla i numeri prima di agire.',
      text: 'Un numero di telefono, un indirizzo, un orario o un importo possono essere uditi male. Riproduci quella riga dal suo timestamp e riascolta prima di fidarti.',
    },
    {
      title: 'Tratta con cura i messaggi degli altri.',
      text: 'Trascrivi solo messaggi che hai inviato o ricevuto e che sei libero di usare, e pensaci prima di condividere il testo di un messaggio che qualcuno ti ha mandato in privato.',
    },
  ],

  faqs: [
    {
      question: "Posso convertire un messaggio vocale WhatsApp in testo senza l'app?",
      answer:
        "Sì. Salva il messaggio vocale come file, aggiungilo a questa pagina e leggi il testo. Non serve un account su questo sito, e non c'è registrazione né accesso.",
    },
    {
      question: 'Che tipo di file è un messaggio vocale WhatsApp?',
      answer:
        'Di solito un file .opus. Questa pagina lo legge direttamente, quindi non serve convertirlo prima in MP3. Funzionano anche i vocali salvati come OGG, M4A, MP3 o AAC.',
    },
    {
      question: "Funziona per l'hindi o per un misto di hindi e inglese?",
      answer:
        "Sì. L'hindi è una delle lingue supportate. Per impostazione predefinita il testo è scritto in caratteri latini (Hinglish); scegli Scrittura originale sotto Stile della trascrizione per il devanagari. Un messaggio che mescola le lingue segue meglio quella principale, quindi controlla le righe segnalate come incerte.",
    },
    {
      question: 'Quanto può durare un messaggio vocale WhatsApp da trascrivere?',
      answer:
        "{limits} I messaggi vocali sono normalmente brevi, quindi di rado conta. Non c'è una quota giornaliera o mensile.",
      browser: {
        answer:
          'Il sito non impone alcun limite di dimensione o durata, e i messaggi vocali sono normalmente brevi, quindi finiscono in fretta. Una registrazione molto lunga richiede tempo e memoria libera sul tuo dispositivo, e alcuni browser potrebbero non gestire un file lunghissimo.',
      },
    },
    {
      question: 'Questo servizio conserva una copia del mio messaggio vocale WhatsApp?',
      answer:
        'Solo per la tua sessione. Il server elimina il file quando la sessione termina, oppure quando premi Elimina ora i miei dati.',
      browser: {
        answer:
          'Solo in questo browser: il messaggio vocale non lascia mai il tuo dispositivo. Il browser lo cancella dopo un periodo di inattività, e puoi cancellarlo prima con Elimina ora i miei dati.',
      },
    },
  ],

  links: [
    {
      label: 'Audio hindi in testo (pagina in inglese)',
      path: '/hindi-audio-to-text',
      note: 'Impostazioni e consigli per il parlato hindi, in devanagari o in caratteri latini.',
    },
    {
      label: 'Trascrizione Hinglish (pagina in inglese)',
      path: '/hinglish-transcription',
      note: "Come si scrive l'hindi in lettere latine, e quando usarlo.",
    },
    {
      label: 'Traduci il parlato in testo inglese',
      path: '/translate-audio-to-english',
      note: "Ottieni testo inglese da un messaggio vocale in un'altra lingua.",
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Cosa cambiare quando un messaggio esce con errori.',
    },
  ],
};
