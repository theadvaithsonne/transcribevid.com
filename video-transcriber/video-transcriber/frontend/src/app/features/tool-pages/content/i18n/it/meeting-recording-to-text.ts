import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Registrazione di riunioni in testo',
  h1: 'Registrazione di riunione in testo: Zoom, Teams e Google Meet',
  lead: 'Salva la registrazione dopo la chiamata, trascinala qui e ottieni una trascrizione con timestamp che puoi cercare, citare e trasformare in verbale. Non costa nulla, non richiede un account e copre più di 50 lingue.',
  dropKind: 'video',
  dropNoun: 'la tua registrazione della riunione',

  whyTitle: 'Perché trascrivere la registrazione di una riunione',
  why: [
    "Poche persone riguardano una riunione di un'ora, ma molte ne hanno bisogno per una cosa sola: chi ha accettato cosa, ed entro quando. Una trascrizione ti permette di cercare una scadenza o un nome, trovare il minuto in cui è stato detto e citarlo esattamente. È un punto di partenza più rapido per verbali ed elenchi di azioni rispetto al riascoltare la chiamata.",
    'Questa pagina lavora su una registrazione che esiste già. Non può unirsi a una chiamata in diretta e non aggiunge i nomi dei parlanti, quindi sostituisce il riascolto, non chi prende appunti. Le riunioni spesso contengono dettagli riservati, quindi sappi dove va una registrazione: qui viene caricata con una connessione cifrata e rimossa automaticamente in seguito.',
  ],
  browserWhy: [
    "Poche persone riguardano una riunione di un'ora, ma molte ne hanno bisogno per una cosa sola: chi ha accettato cosa, ed entro quando. Una trascrizione ti permette di cercare una scadenza o un nome, trovare il minuto in cui è stato detto e citarlo esattamente. È un punto di partenza più rapido per verbali ed elenchi di azioni rispetto al riascoltare la chiamata.",
    'Questa pagina lavora su una registrazione che esiste già. Non può unirsi a una chiamata in diretta e non aggiunge i nomi dei parlanti, quindi sostituisce il riascolto, non chi prende appunti. Le riunioni spesso contengono dettagli riservati: il browser trascrive la registrazione sul tuo dispositivo e non viene caricato nulla, e nulla viene conservato quando la sessione termina.',
  ],

  sections: [
    {
      title: 'Dove trovare la registrazione della tua riunione',
      paragraphs: [
        "Ogni strumento per riunioni salva le registrazioni nel proprio posto, e i nomi dei menu, le cartelle e ciò che consente il tuo piano cambiano tra le versioni, quindi consideralo una guida. Se puoi esportare solo l'audio, un file M4A o MP3 è più piccolo e viene letto altrettanto bene. Zoom, Microsoft Teams e Google Meet sono nomi dei rispettivi proprietari e questo sito non è collegato a essi.",
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'Una registrazione locale viene salvata sul tuo computer al termine della riunione, in genere come video MP4 e file audio M4A. Una registrazione nel cloud si scarica dalla pagina delle registrazioni del tuo account Zoom.',
        },
        {
          title: 'Microsoft Teams.',
          text: "Dopo la riunione la registrazione viene archiviata in OneDrive o SharePoint, a seconda del tipo di riunione, e nella chat della riunione compare un link. Aprilo lì e scarica l'MP4 se il tuo account consente i download.",
        },
        {
          title: 'Google Meet.',
          text: "Le registrazioni vengono salvate in Google Drive, di solito in una cartella Meet Recordings, e l'organizzatore riceve un link. Scarica l'MP4 da Drive.",
        },
      ],
    },
    {
      title: 'Dalla trascrizione al verbale',
      paragraphs: [
        "Una trascrizione grezza non è ancora un verbale, ma lo rende rapido da scrivere. Quando la trascrizione è finita, digita una parola come scadenza, accordo o azione nella casella Cerca nel testo sopra di essa, oppure il nome di una persona coinvolta. La casella mostra quante righe corrispondono, e le frecce su e giù passano dall'una all'altra. Leggi intorno a ogni risultato, riproduci quella riga dal suo timestamp se non è chiara e copia le righe nei tuoi appunti con i loro orari, così chiunque può verificare la registrazione.",
        "Se un nome è uscito scritto in due modi diversi, cerca l'errore, apri Sostituisci…, scrivi quello giusto e applicalo a tutte le righe in una volta. Scarica il Markdown da incollare in un'app di note, oppure il PDF da inviare in giro. Le righe riportano un orario ma non un'etichetta del parlante, quindi scrivi tu i nomi mentre modifichi, usando la registrazione per verificare chi ha parlato.",
      ],
    },
    {
      title: 'Permesso, regole e cautela',
      paragraphs: [
        'Avvisa tutti prima di registrare una riunione e ottieni il loro permesso, e segui le regole della tua organizzazione su registrazioni e trascrizioni. La trascrizione di una riunione riservata è delicata quanto la registrazione, quindi conservala e condividila con la stessa cautela. Questa pagina non fornisce consulenza legale.',
      ],
    },
  ],

  howTitle: 'Come convertire la registrazione di una riunione in testo',
  howToDescription:
    'Aggiungi la registrazione della riunione, scegli la lingua, attendi la trascrizione e scaricala come testo o sottotitoli.',
  steps: [
    {
      title: 'Aggiungi la registrazione',
      text: "Premi Scegli un file, oppure trascina la registrazione sul riquadro qui sopra. Funzionano sia un video MP4 sia un file audio M4A, e si usa solo l'audio. Il riquadro accetta una registrazione alla volta e la passa al caricatore nella pagina successiva, dove Aggiungi un altro file porta dentro il resto di una giornata di chiamate.",
    },
    {
      title: 'Scegli lingua e qualità',
      text: 'Nella pagina successiva scegli la lingua parlata dalle persone, oppure lascia Rileva automaticamente. Standard va bene per la maggior parte delle chiamate. Dove il tuo dispositivo le offre, Alta precisione e Massima precisione si addicono a chi parla veloce o a un audio scadente; altrimenti compaiono disattivate con il motivo. Entrambe sono più lente e richiedono un download iniziale più grande. Se le persone cambiano lingua, scegli quella principale e controlla le righe segnalate come incerte. Poi premi Trascrivi.',
    },
    {
      title: 'Attendi la trascrizione',
      text: 'Le righe compaiono mentre la registrazione viene elaborata, con una barra di avanzamento e una stima del tempo rimanente. Una riunione lunga richiede più tempo.',
      browser: {
        text: 'Le righe compaiono mentre la registrazione viene elaborata, con una barra di avanzamento e una stima del tempo rimanente. Il lavoro lo fa il tuo dispositivo, quindi una riunione lunga richiede più tempo: tieni aperta questa pagina finché non finisce.',
      },
    },
    {
      title: 'Cerca, modifica ed esporta',
      text: 'Scrivi nomi e parole di decisione in Cerca nel testo per saltare tra le righe, riproduci una riga dal suo timestamp per verificarla e correggi gli errori. Poi scarica TXT, Markdown o PDF. Aggiungi a mano i nomi dei parlanti mentre modifichi.',
    },
  ],

  formatsTitle: 'File di registrazione delle riunioni e download',
  formatsIntro:
    'Le registrazioni di Zoom, Teams e Meet sono di solito MP4 o M4A. Funzionano anche altri file video e audio, e si legge solo la traccia audio.',
  uploadTitle: 'File di registrazione che puoi aggiungere',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: "l'intera riunione come testo semplice" },
    { name: 'Markdown', use: "appunti temporizzati da incollare in un'app di note" },
    { name: 'PDF', use: 'una copia da stampare o inviare in giro' },
    { name: 'SRT', use: 'righe temporizzate per sottotitolare la registrazione' },
  ],

  tipsTitle: 'Consigli per le trascrizioni delle riunioni',
  tips: [
    {
      title: "Usa il file solo audio quando c'è.",
      text: 'Contiene lo stesso parlato in un file molto più piccolo, quindi è più rapido da aggiungere e da elaborare.',
    },
    {
      title: 'Inserisci nomi e termini nel suggerimento di vocabolario.',
      text: 'In Altre opzioni, elenca le persone, i nomi dei prodotti e gli acronimi usati nella riunione. In questo modo nomi e acronimi escono come ti aspetti.',
    },
    {
      title: 'Aspettati errori dalle sovrapposizioni.',
      text: 'Quando due persone parlano insieme, il riconoscitore non riesce a separarle. Le righe di cui non è sicuro sono segnalate, quindi rivedi prima quelle.',
    },
    {
      title: 'Resta entro i limiti.',
      text: 'Le registrazioni oltre i limiti di dimensione o durata indicati in questa pagina non possono essere elaborate, quindi dividi prima una chiamata molto lunga in parti.',
      browser: {
        title: 'Le chiamate lunghe richiedono più tempo.',
        text: "Il sito non impone alcun limite di durata, ma la registrazione di un workshop di un'intera giornata richiede tempo e memoria libera sul tuo dispositivo. Per leggere prima la prima ora, dividi il file in parti con un editor video.",
      },
    },
    {
      title: 'Condividi la trascrizione con cautela.',
      text: 'Inviala solo alle persone che erano alla riunione o a cui serve, ed eliminala quando non ti serve più.',
    },
  ],

  faqs: [
    {
      question:
        'TranscribeVid può unirsi alla mia chiamata Zoom o Teams e trascriverla in diretta?',
      answer:
        'No. Lavora su una registrazione che salvi dopo la riunione. Non può unirsi a una chiamata e non è sottotitolazione in diretta. Per i sottotitoli in diretta, usa la funzione del tuo strumento per riunioni.',
    },
    {
      question: 'La trascrizione di una riunione mostra chi ha detto cosa?',
      answer:
        'No. Le righe riportano un orario ma nessun nome. Aggiungi tu i nomi mentre modifichi e verifica ciascuno con la registrazione.',
    },
    {
      question: 'È sicuro trascrivere qui la registrazione di una riunione riservata?',
      answer:
        'Il server riceve la registrazione con una connessione cifrata e la elimina quando la tua sessione termina, o prima se premi Elimina ora i miei dati. Verifica prima cosa consente la tua organizzazione. Questa non è consulenza legale.',
      browser: {
        answer:
          'La registrazione non viene caricata: il browser la trascrive sul tuo dispositivo e la cancella dopo un periodo di inattività o quando premi Elimina ora i miei dati. Una trascrizione che scarichi è un normale file sul tuo dispositivo, quindi custodiscila come faresti con la registrazione e verifica cosa consente la tua organizzazione. Questa non è consulenza legale.',
      },
    },
    {
      question: 'Quanto può durare la registrazione di una riunione da trascrivere?',
      answer: '{limits} I file più lunghi non possono essere elaborati, quindi dividili prima.',
      browser: {
        answer:
          'Non è fissato alcun tetto per la registrazione in sé, perché il lavoro avviene sul tuo dispositivo. Ciò che ti limita sono tempo e memoria libera: una chiamata di diverse ore è possibile, la pagina ti avvisa se il tuo dispositivo sembra troppo lento per farla, e un browser senza supporto WebCodecs potrebbe non farcela con un file molto lungo.',
      },
    },
    {
      question: 'Cosa succede se le persone cambiano lingua durante la riunione?',
      answer:
        "Scegli la lingua più parlata. Il riconoscimento segue meglio la lingua principale, quindi le parole in un'altra lingua possono essere scritte male. Le righe di cui non è sicuro sono segnalate: controllale con la registrazione.",
    },
  ],

  links: [
    {
      label: 'MP4 in testo',
      path: '/mp4-to-text',
      note: 'Impostazioni per una riunione salvata come video MP4.',
    },
    {
      label: 'M4A in testo',
      path: '/m4a-to-text',
      note: 'Per il file solo audio, che è più piccolo del video.',
    },
    {
      label: 'Trascrizione di interviste',
      path: '/interview-transcription',
      note: 'Per una conversazione registrata a due, con note su consenso e verifica delle citazioni.',
    },
    {
      label: 'Trascrivere un video senza caricarlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Dove resta la tua registrazione e come verificarlo nel browser.',
    },
  ],
};
