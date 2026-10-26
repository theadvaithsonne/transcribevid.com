import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Trascrizione di interviste',
  h1: 'Trascrizione di interviste senza account',
  lead: "Trasforma un'intervista registrata in testo con timestamp che puoi cercare, citare e confrontare con la registrazione. Pensato per ricerca, giornalismo e colloqui di selezione: gratis, senza registrazione, in più di 50 lingue.",
  dropKind: 'video',
  dropNoun: "la tua registrazione dell'intervista",

  whyTitle: "Perché trascrivere un'intervista",
  why: [
    "Un'intervista vale di più quando puoi cercarvi dentro. Una trascrizione ti permette di trovare dove un partecipante ha citato un argomento, citarlo esattamente, confrontare una citazione con la registrazione e confrontare le risposte tra più interviste. Ricercatori, giornalisti, storici orali e chi conduce interviste di ricerca sugli utenti o colloqui di selezione lavorano tutti così.",
    'Le interviste contengono spesso dettagli privati o sensibili. Qui la registrazione viene caricata con una connessione cifrata ed eliminata automaticamente in seguito. Ottieni il consenso di tutti prima di registrare, segui le regole della tua organizzazione o del tuo comitato etico e tratta la trascrizione con la stessa cura della registrazione.',
  ],
  browserWhy: [
    "Un'intervista vale di più quando puoi cercarvi dentro. Una trascrizione ti permette di trovare dove un partecipante ha citato un argomento, citarlo esattamente, confrontare una citazione con la registrazione e confrontare le risposte tra più interviste. Ricercatori, giornalisti, storici orali e chi conduce interviste di ricerca sugli utenti o colloqui di selezione lavorano tutti così.",
    'Le interviste contengono spesso dettagli privati o sensibili, quindi conta dove va il file. Il browser trascrive la registrazione sul tuo dispositivo e non viene caricato nulla. Ottieni il consenso di tutti prima di registrare, segui le regole della tua organizzazione o del tuo comitato etico e tratta la trascrizione con la stessa cura della registrazione: il testo scaricato è un file sul tuo dispositivo come un altro.',
  ],

  sections: [
    {
      title: 'Cosa ti dà e cosa non ti dà la trascrizione',
      paragraphs: ['Conosci i limiti prima di costruire su una trascrizione.'],
      bullets: [
        {
          title: 'Nessuna etichetta dei parlanti.',
          text: 'Ogni riga ha un timestamp, ma la trascrizione non dice chi sta parlando. Aggiungi a mano Intervistatore e Partecipante mentre modifichi, verificando con la registrazione.',
        },
        {
          title: 'Una lettura pulita, non strettamente letterale.',
          text: 'I riconoscitori spesso omettono balbettii e alcune parole riempitive come ehm. Se il tuo studio richiede una trascrizione rigorosamente letterale, riproduci la registrazione accanto al testo e aggiungi ciò che manca.',
        },
        {
          title: "Solo dopo l'intervista.",
          text: 'Funziona su una registrazione salvata. Non si unisce a una chiamata e non trascrive in diretta.',
        },
      ],
    },
    {
      title: 'Controllare una trascrizione prima di citarla',
      paragraphs: [
        "Prima di pubblicare una citazione o di citare un partecipante, riproduci la riga dal suo timestamp e ascolta. Le righe di cui il riconoscitore non era sicuro sono segnalate, quindi parti da quelle. Controlla nomi, numeri e date, e ogni parola che cambierebbe il significato se fosse sbagliata, come può e non può. Per trovare ogni punto in cui compare un nome o un termine, digitalo nella casella Cerca nel testo sopra la trascrizione finita: conta le righe corrispondenti e le frecce passano dall'una all'altra.",
        "Conserva la registrazione come documento primario e tratta la trascrizione come una copia di lavoro. Se descrivi il tuo metodo in un rapporto o in un articolo, di' che la trascrizione è stata creata con il riconoscimento vocale e poi controllata a mano.",
      ],
    },
    {
      title: 'Consenso, conservazione e anonimato',
      paragraphs: [
        "Spiega ai partecipanti come verranno conservati la registrazione e la trascrizione e chi li vedrà. Se hai promesso l'anonimato, rimuovi nomi e dettagli che potrebbero identificare qualcuno prima di condividere estratti. Questa pagina non può farlo al posto tuo e non fornisce consulenza legale.",
      ],
    },
  ],

  howTitle: "Come trascrivere un'intervista",
  howToDescription:
    "Aggiungi la registrazione dell'intervista, scegli la lingua, aggiungi i nomi, attendi la trascrizione, poi controllala e scaricala.",
  steps: [
    {
      title: "Aggiungi la registrazione dell'intervista",
      text: "Premi Scegli un file, oppure trascina l'intervista sul riquadro qui sopra. Funzionano sia audio sia video. Aggiungi qui un'intervista, poi usa Aggiungi un altro file nella pagina successiva per il resto della tua raccolta.",
    },
    {
      title: 'Scegli lingua e qualità',
      text: "Nella pagina successiva seleziona la lingua dell'intervista, oppure lascia Rileva automaticamente. Standard va bene per una conversazione a due in un ambiente silenzioso. Eco, una linea telefonica o un forte accento richiedono Alta precisione dove il tuo dispositivo può eseguirla; un dispositivo che non può mostra la scelta disattivata con un motivo. È più lenta e richiede un download iniziale più grande.",
    },
    {
      title: 'Aggiungi nomi e termini, poi inizia',
      text: 'In Altre opzioni, elenca nel suggerimento di vocabolario i nomi dei partecipanti, le loro organizzazioni e gli eventuali termini specialistici, così vengono scritti come vuoi. Poi premi Trascrivi.',
    },
    {
      title: 'Controlla, etichetta ed esporta',
      text: 'Riproduci le righe dai loro timestamp, correggi gli errori e aggiungi a mano le etichette dei parlanti. Poi scarica TXT o PDF per i tuoi archivi, oppure Markdown o JSON se ti servono righe temporizzate.',
    },
  ],

  formatsTitle: 'File di registrazione delle interviste e download',
  formatsIntro:
    'Le interviste arrivano da telefoni, registratori e videochiamate. Si può aggiungere uno qualsiasi di questi file, e si legge solo la traccia audio.',
  uploadTitle: 'File di registrazione che puoi aggiungere',
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'testo semplice da leggere, citare e codificare' },
    { name: 'PDF', use: 'una copia da stampare o archiviare' },
    { name: 'Markdown', use: "testo temporizzato per un'app di note o un software di codifica" },
    { name: 'JSON', use: 'righe temporizzate per il software di analisi' },
  ],

  tipsTitle: 'Consigli per le registrazioni delle interviste',
  tips: [
    {
      title: 'Metti il microfono vicino.',
      text: "Posizionalo vicino al partecipante e usa una cuffia o un microfono a clip per telefonate e videochiamate. Un microfono dall'altra parte della stanza o un ambiente con eco di solito costa più precisione di quanta qualsiasi impostazione possa recuperare.",
    },
    {
      title: "Dichiara data e nomi all'inizio.",
      text: "Di' chi partecipa e quando, all'inizio della registrazione. Rende il file facile da etichettare e la trascrizione facile da archiviare in seguito.",
    },
    {
      title: 'Conserva la registrazione originale.',
      text: "Non eliminare mai l'audio una volta ottenuto il testo. È la registrazione a risolvere un dubbio su una citazione.",
    },
    {
      title: 'Resta entro i limiti.',
      text: "Tutto ciò che supera i limiti indicati in questa pagina viene respinto, quindi dividi prima un'intervista molto lunga in un punto naturale.",
      browser: {
        title: 'Le interviste lunghe richiedono più tempo.',
        text: "Non c'è un tetto alla durata, anche se una registrazione lunga richiede tempo e memoria libera sul tuo dispositivo, e un browser senza WebCodecs può faticare con un file molto lungo. Dividila in un punto naturale se preferisci iniziare dalla prima parte.",
      },
    },
    {
      title: 'Cancella i tuoi dati su un computer condiviso.',
      text: 'Quando hai salvato ciò che ti serve, premi Elimina ora i miei dati, così la trascrizione non resta nella sessione.',
    },
  ],

  faqs: [
    {
      question: "Posso trascrivere qui un'intervista riservata?",
      answer:
        'La tua registrazione viene caricata con una connessione cifrata ed eliminata dal server quando la sessione termina, o prima se premi Elimina ora i miei dati. Prima di fare affidamento su questo, controlla cosa richiede la tua organizzazione o il tuo comitato etico. Questa non è consulenza legale.',
      browser: {
        answer:
          'Non avviene alcun caricamento: la registrazione resta sul tuo dispositivo mentre il browser la trascrive, e il browser la cancella dopo un periodo di inattività o quando premi Elimina ora i miei dati. Una trascrizione scaricata è un normale file, quindi controlla le regole della tua organizzazione o del tuo comitato etico. Questa non è consulenza legale.',
      },
    },
    {
      question: "La trascrizione dell'intervista include «ehm» e «uhm»?",
      answer:
        'Spesso no. La trascrizione è una lettura pulita più che una trascrizione rigorosamente letterale, e alcuni balbettii e parole riempitive vengono omessi. Se ti servono tutti, riproduci la registrazione accanto al testo e aggiungili.',
    },
    {
      question: "La trascrizione sa distinguere l'intervistatore dal partecipante?",
      answer:
        'No. La trascrizione non segna chi sta parlando. Scrivi Intervistatore e Partecipante nel testo mentre modifichi, usando la registrazione per verificare ogni intervento.',
    },
    {
      question: "Quanto può durare un'intervista da trascrivere?",
      answer: "{limits} Un'intervista più lunga potrebbe dover essere divisa.",
      browser: {
        answer:
          "La durata dell'intervista non ha un tetto. Il lavoro lo fa il tuo dispositivo, quindi un'intervista lunga richiede più tempo e memoria libera, e la pagina ti dice se il tuo dispositivo sembra troppo lento.",
      },
    },
    {
      question: 'Posso usare queste trascrizioni nella mia ricerca o nel mio articolo?',
      answer:
        "Sì. Controllale con la registrazione prima di citare qualcuno, di' nel tuo metodo che è stato usato il riconoscimento vocale e segui le regole della tua istituzione o della tua testata.",
    },
  ],

  links: [
    {
      label: 'Registrazioni di riunioni in testo',
      path: '/meeting-recording-to-text',
      note: 'Per le chiamate registrate, con note su come trasformare una trascrizione in verbale.',
    },
    {
      label: 'Video in testo',
      path: '/video-to-text',
      note: 'La pagina generale per qualsiasi video registrato.',
    },
    {
      label: 'Trascrivere un video senza caricarlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Cosa succede a una registrazione nel tuo browser, e come verificarlo di persona.',
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Scelte di audio e impostazioni che riducono gli errori.',
    },
  ],
};
