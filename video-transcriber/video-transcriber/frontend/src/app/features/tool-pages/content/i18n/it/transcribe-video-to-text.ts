import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Trascrivere video in testo',
  h1: 'Trascrivere un video in testo: gratis, senza registrazione, senza limite giornaliero',
  browserH1: 'Trascrivere un video in testo: gratis, senza registrazione, senza limiti, senza caricare nulla',
  lead: "Aggiungi un video e ottieni il suo parlato sotto forma di testo, con un orario su ogni riga. Non c'è nessun account da creare e nessun limite giornaliero, quindi il video successivo può partire appena finisce questo.",
  browserLead:
    "Aggiungi un video e ottieni il suo parlato sotto forma di testo, con un orario su ogni riga. Non c'è nessun account da creare, nessun limite giornaliero e nessun limite di dimensione del file, e il video non viene mai caricato: il lavoro lo fa il tuo dispositivo.",
  dropKind: 'video',
  dropNoun: 'il tuo video',

  whyTitle: 'Cosa dovrebbe significare «gratis» quando trascrivi un video',
  why: [
    'Molti siti che promettono la «trascrizione video gratis» ti concedono un minuto, o pochi file, e poi chiedono un account o una carta. Prima di sceglierne uno, controlla quattro cose: se devi registrarti, quanti minuti o file ottieni, quanto può essere grande un file e se puoi scaricare il risultato.',
    "Qui la risposta a ciascuna è semplice. Aggiungi il video, non c'è nulla a cui registrarsi, non esiste un conteggio giornaliero o mensile e la trascrizione si scarica in TXT, SRT, VTT, PDF, Markdown o JSON senza costi. Lo strumento non indica chi parla e non accetta link: aggiungi il file vero e proprio.",
  ],
  browserWhy: [
    'Molti siti che promettono la «trascrizione video gratis» ti concedono un minuto, o pochi file, e poi chiedono un account o una carta. Prima di sceglierne uno, controlla quattro cose: se devi registrarti, quanti minuti o file ottieni, quanto può essere grande un file e se puoi scaricare il risultato.',
    "Qui la risposta a ciascuna è semplice. Aggiungi il video, non c'è nulla a cui registrarsi, non esiste un conteggio giornaliero o mensile né un limite di dimensione, e la trascrizione si scarica in TXT, SRT, VTT, PDF, Markdown o JSON senza costi. Poiché il lavoro lo fa il tuo dispositivo, il vero limite è la sua memoria: un video molto lungo può essere troppo per un telefono, quindi conviene tagliarlo prima in parti. Lo strumento non indica chi parla e non accetta link: aggiungi il file vero e proprio.",
  ],

  sections: [
    {
      title: 'Limiti gratuiti di altri siti per trascrivere video, verificati a ottobre 2026',
      paragraphs: [
        "Queste sono citazioni dalla pagina di ciascuno strumento, così come si leggeva il 28 ottobre 2026, tradotte dalle pagine in inglese dei rispettivi servizi. I piani cambiano, quindi guarda la pagina prima di fare affidamento su un numero. La guida collegata in fondo a questa pagina contiene la tabella completa con il link a ogni fonte.",
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '«Trascrizioni illimitate gratis. Nessuna registrazione richiesta.» Lo strumento gratuito accetta file MP3, WAV, MP4 e MOV e attribuisce a un solo interlocutore tutto il testo di una registrazione con più voci.',
        },
        { title: 'VoiceCheap.', text: '«Gratis per file fino a 60 minuti, con 1 trascrizione al giorno.»' },
        { title: 'RecCloud.', text: '«Il nostro piano gratuito consente video fino a 10 minuti di durata.»' },
        { title: 'Caption-X.', text: '«Il piano gratuito comprende 5 trascrizioni in totale, fino a 5 minuti ciascuna.»' },
        { title: 'Maestra.', text: 'Una «anteprima di 1 minuto» e «Registrati per scaricare o esportare la tua trascrizione.»' },
        { title: 'Any2Text.', text: '«Primi 15 minuti gratis», poi $0.035 al minuto.' },
      ],
    },
    {
      title: 'Dove va il tuo video mentre viene trascritto',
      paragraphs: [
        "Il video viene inviato al server che gestisce questo sito, trascritto lì ed eliminato alla fine della tua sessione. Non viene pubblicato da nessun'altra parte.",
      ],
      browser: {
        paragraphs: [
          "Il video resta sul tuo dispositivo. Il browser lo legge, ne estrae l'audio e vi esegue il modello di riconoscimento vocale Whisper, quindi nessun file viene inviato a noi o ad altri.",
          'Vengono scaricati solo gli strumenti: la pagina, il modello vocale e il motore che lo esegue. Il modello pesa da circa 77 MB a poco più di 1 GB, a seconda del livello di qualità e del dispositivo, e in seguito resta salvato nel browser. Per verificarlo di persona, apri il pannello di rete del browser mentre un video viene trascritto.',
        ],
      },
    },
    {
      title: 'Quattro livelli di qualità per video diversi',
      paragraphs: [
        'Più veloce usa il piccolo modello Base e va bene per una bozza rapida di un parlato chiaro. Standard ne usa uno più grande ed è la scelta abituale. Alta precisione esegue Large v3 Turbo e gestisce meglio gli accenti e le stanze rumorose. Massima precisione esegue il Large v3 completo e commette meno errori, ma richiede più tempo.',
        'Più il modello è grande, più tempo ci vuole: Più veloce richiede meno tempo e Massima precisione il più lungo. Prova prima Standard e passa a un livello più alto solo se il testo non è abbastanza buono.',
      ],
      browser: {
        paragraphs: [
          'Più veloce usa il piccolo modello Base e va bene per una bozza rapida di un parlato chiaro. Standard ne usa uno più grande ed è la scelta abituale. Alta precisione esegue Large v3 Turbo e gestisce meglio gli accenti e le stanze rumorose. Massima precisione esegue il Large v3 completo e commette meno errori, ma richiede più tempo.',
          'Il lavoro lo fa il tuo dispositivo, quindi la velocità dipende da lui: un portatile recente è molto più rapido di un telefono datato, e su un telefono il livello da usare è Più veloce. Su un portatile prova prima Standard e passa a un livello più alto solo se il testo non è abbastanza buono.',
        ],
      },
    },
  ],

  howTitle: 'Come trascrivere un video in quattro passaggi',
  howToDescription:
    'Aggiungi il video, scegli la lingua e il livello di qualità, attendi che compaia il testo, poi modificalo e scaricalo.',
  steps: [
    {
      title: 'Aggiungi il video',
      text: 'Trascina il file nel riquadro in cima a questa pagina oppure premi Scegli un file. Il link a un video sul web non viene accettato.',
    },
    {
      title: 'Scegli lingua e qualità',
      text: "Indica la lingua parlata se la conosci e scegli un livello di qualità. Standard è un buon inizio; usa Alta precisione o Massima precisione per accenti, rumore o una lingua come l'hindi.",
    },
    {
      title: 'Attendi il testo',
      text: 'Le righe compaiono una alla volta, con una barra di avanzamento e il tempo rimanente.',
      browser: {
        text: 'Le righe compaiono una alla volta, con una barra di avanzamento e il tempo rimanente. La prima volta che usi un livello il modello viene scaricato una sola volta; i video successivi partono subito.',
      },
    },
    {
      title: 'Modifica e scarica',
      text: "Correggi qualsiasi riga nell'editor, poi scarica TXT, SRT, VTT, PDF, Markdown o JSON. Scarica prima di andare via: al termine della sessione non viene conservato nulla per te.",
      browser: {
        text: "Correggi qualsiasi riga nell'editor, poi scarica TXT, SRT, VTT, PDF, Markdown o JSON. La trascrizione resta in questo browser per un po', ma scarica ciò che vuoi conservare.",
      },
    },
  ],

  formatsTitle: 'Video che puoi aggiungere e file che ottieni',
  formatsIntro: "Quello che viene letto è la traccia audio, quindi l'immagine può avere qualsiasi qualità. Funzionano anche i file solo audio.",
  uploadTitle: 'File video che puoi aggiungere',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'testo semplice, oppure con un orario su ogni riga' },
    { name: 'SRT', use: 'sottotitoli per editor e lettori' },
    { name: 'VTT', use: 'sottotitoli per i video sul web' },
    { name: 'PDF', use: 'una trascrizione da stampare o condividere' },
    { name: 'Markdown', use: 'appunti con timestamp' },
    { name: 'JSON', use: 'parole e tempi per gli sviluppatori' },
  ],

  tipsTitle: 'Come ottenere di più da una trascrizione gratuita',
  tips: [
    {
      title: 'Prova il primo minuto prima di tutto il video.',
      text: 'Taglia o riproduci un minuto del video e trascrivi quello. Se il testo è sbagliato, cambia la lingua o il livello di qualità prima di dedicare tempo al file completo.',
    },
    {
      title: 'Controlla ciò che vedi sullo schermo oltre a ciò che senti.',
      text: 'Viene scritto solo il parlato. I nomi che compaiono su una slide ma che nessuno pronuncia non saranno nel testo.',
    },
    {
      title: 'Dividi una registrazione molto lunga.',
      text: "Un video di diverse ore è più facile da gestire in parti di circa un'ora ciascuna: puoi iniziare a leggere prima e rifare un errore costa meno.",
      browser: {
        title: 'Dividi una registrazione molto lunga su un telefono.',
        text: "Non c'è un limite di dimensione, ma un video di diverse ore richiede molta memoria. Su un telefono sono molto più sicure parti di circa un'ora ciascuna, mentre su un portatile di solito si può andare molto oltre.",
      },
    },
    {
      title: 'Scarica anche il file dei sottotitoli, oltre al testo.',
      text: 'Il file SRT conserva i tempi, così la stessa elaborazione ti dà sia una trascrizione da leggere sia i sottotitoli da aggiungere al video.',
    },
  ],

  faqs: [
    {
      question: 'Posso incollare un link di YouTube, TikTok o Google Drive al posto di un file?',
      answer: 'No. Questo strumento lavora su un file che aggiungi o registri. Se il video è tuo, usa il file originale; per il video di qualcun altro devi avere il diritto di usarlo.',
    },
    {
      question: 'La trascrizione mostrerà chi sta parlando?',
      answer: "No. Le righe hanno gli orari ma non i nomi di chi parla. Puoi scrivere i nomi nel testo, nell'editor, cosa rapida per un'intervista a due voci.",
    },
    {
      question: "Non c'è davvero un limite al numero di video che posso trascrivere?",
      answer: "Non ci sono account, piani né conteggi giornalieri o mensili. {limits} Se molte persone usano il servizio, il tuo video potrebbe restare per un po' in coda.",
      browser: {
        answer:
          "Non ci sono account, piani né conteggi giornalieri o mensili, e nemmeno un limite di dimensione. L'unico limite è il tuo dispositivo: un video molto lungo richiede più tempo e più memoria, quindi un telefono se la cava meglio con parti di circa un'ora. Gli annunci pubblicitari mantengono gratuito il sito e nessuno viene mostrato mentre un video viene trascritto.",
      },
    },
    {
      question: 'Quale livello di qualità va bene per un video lungo?',
      answer: "Standard è la scelta abituale. Più veloce è più rapido ma commette più errori; Alta precisione e Massima precisione richiedono più tempo e danno buoni risultati con accenti, rumore e lingue come l'hindi.",
    },
    {
      question: 'Il video lascia il mio computer?',
      answer: 'Viene inviato al server che gestisce questo sito ed eliminato alla fine della tua sessione.',
      browser: {
        answer: 'No. Il browser trascrive il video sul tuo dispositivo e nessun file viene inviato a noi. Vengono scaricati, una sola volta, solo il modello vocale e il suo motore.',
      },
    },
  ],

  links: [
    {
      label: 'Strumenti gratuiti da video a testo a confronto',
      path: '/guides/free-video-to-text-tools-compared',
      note: "Tutti i limiti in un'unica tabella, citati dalla pagina di ciascuno strumento.",
    },
    {
      label: 'Trascrivere un video senza caricarlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Come il lavoro resta sul tuo dispositivo e come verificarlo da solo.',
    },
    {
      label: 'Come trascrivere un video in testo',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Cinque modi per farlo e quale si adatta al tuo video.',
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Abitudini e impostazioni che riducono gli errori su qualsiasi video.',
    },
  ],
};
