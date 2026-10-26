import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Generatore di trascrizioni per podcast',
  h1: 'Genera la trascrizione di un podcast dal tuo file audio',
  lead: 'Inserisci una puntata e ottieni una trascrizione completa, con timestamp, da pubblicare accanto, cercare, citare o trasformare in note di puntata. Gratis, senza registrazione, e disponibile in più di 50 lingue.',
  dropKind: 'audio',
  dropNoun: 'la tua puntata del podcast',

  whyTitle: 'Perché dare una trascrizione a una puntata',
  why: [
    "Una trascrizione rende una puntata più facile da trovare, citare e seguire. Chi ascolta può scorrerla, leggere in silenzio o in un luogo rumoroso e cercarvi il nome di un ospite. Possono usarla anche gli ascoltatori sordi o con problemi di udito e chi ascolta in una seconda lingua. I motori di ricerca, inoltre, leggono il testo molto più facilmente dell'audio.",
    "Questa pagina crea la prima bozza: l'intera puntata come testo, con l'orario su ogni riga. Prevedi di modificarla. Il riconoscimento vocale non conosce i nomi dei tuoi ospiti né il gergo del tuo programma, e non etichetta i parlanti. Usala su puntate che hai realizzato tu o per le quali hai l'autorizzazione.",
  ],

  sections: [
    {
      title: 'Dalla trascrizione alla pagina della puntata',
      paragraphs: ['Una sola trascrizione può alimentare diverse cose che pubblichi già.'],
      bullets: [
        {
          title: 'Note di puntata.',
          text: "Leggi la trascrizione una volta, scegli gli argomenti e scrivi un breve riassunto con il timestamp di ciascuno. Scarica il Markdown da incollare in un'app di note o in un editor di blog.",
        },
        {
          title: 'Una trascrizione sotto il lettore.',
          text: 'Scarica il TXT, sistema i paragrafi e aggiungi a mano nomi come Conduttore e Ospite. La trascrizione non ha etichette dei parlanti proprie.',
        },
        {
          title: 'Didascalie per una versione video.',
          text: 'Se pubblichi la puntata anche come video, scarica SRT o VTT e caricalo come didascalie.',
        },
        {
          title: 'Citazioni e clip.',
          text: 'Trova la riga, leggi il suo timestamp e taglia la clip dal tuo audio in quel punto.',
        },
      ],
    },
    {
      title: 'Nomi, gergo e pubblicità giusti',
      paragraphs: [
        'Nomi degli ospiti, marchi e termini del programma sono ciò che un riconoscitore sbaglia di più. Prima di iniziare, elencali nel suggerimento di vocabolario in Altre opzioni: il conduttore, gli ospiti, il nome del programma, i prodotti e ogni termine che usi spesso. Quando la trascrizione è pronta, digita un nome scritto male nella casella Cerca nel testo sopra di essa, apri Sostituisci…, inserisci la grafia giusta e applicala a tutte le righe corrispondenti in una volta. Le righe di cui il riconoscitore non era sicuro sono segnalate, quindi rivedi prima quelle.',
        "Lascia attiva l'opzione Salta silenzi e musica in Altre opzioni, così sigle e pause lunghe non si trasformano in parole inventate. Effetti sonori e basi musicali sotto uno spot possono comunque aggiungere testo sporadico, quindi elimina tutto ciò che non è stato detto.",
      ],
    },
  ],

  howTitle: 'Come generare la trascrizione di un podcast',
  howToDescription:
    'Aggiungi la puntata, elenca nomi e termini, attendi la trascrizione e scaricala per la pagina della puntata.',
  steps: [
    {
      title: 'Aggiungi la puntata',
      text: "Trascina la puntata sul riquadro qui sopra, oppure premi Scegli un file. L'MP3 è il formato abituale dei podcast, ma funzionano anche WAV, M4A, FLAC e altri. In questo riquadro entra una puntata alla volta; nella pagina successiva, Aggiungi un altro file ti permette di includere altre puntate.",
    },
    {
      title: 'Elenca nomi e termini',
      text: 'Nella pagina successiva apri Altre opzioni e inserisci nel suggerimento di vocabolario il conduttore, gli ospiti, il nome del programma e il gergo. Scegli la lingua parlata, oppure lascia Rileva automaticamente.',
    },
    {
      title: 'Avvia e attendi la trascrizione',
      text: 'Premi Trascrivi. Il testo compare riga per riga con una barra di avanzamento. Standard va bene per la maggior parte delle puntate. Sovrapposizioni o audio scadente sono i casi in cui Alta precisione o Massima precisione si guadagnano il tempo. Sono più lente, richiedono un download iniziale più grande e compaiono disattivate con un motivo su un dispositivo che non può eseguirle.',
    },
    {
      title: 'Modifica ed esporta',
      text: 'Correggi nomi e punteggiatura e aggiungi a mano i nomi dei parlanti. Poi scarica TXT o Markdown per la pagina della puntata, oppure SRT o VTT per una versione video.',
    },
  ],

  formatsTitle: 'File dei podcast e download',
  formatsIntro:
    "L'MP3 è il formato abituale dei podcast. Gli altri file audio vengono letti allo stesso modo, e sono accettati anche i file video.",
  uploadTitle: 'File audio che puoi aggiungere',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'la trascrizione da pubblicare sotto il lettore' },
    { name: 'Markdown', use: 'note di puntata con timestamp' },
    { name: 'SRT', use: 'didascalie per una versione video' },
    { name: 'VTT', use: 'una traccia di trascrizione per i lettori web' },
    { name: 'PDF', use: 'una trascrizione da condividere o stampare' },
  ],

  tipsTitle: 'Consigli per le trascrizioni dei podcast',
  tips: [
    {
      title: 'Trascrivi il mix finale.',
      text: 'La puntata masterizzata, con sigla e spot, è ciò che sentono gli ascoltatori. I suoi timestamp corrispondono allora al file che pubblichi.',
    },
    {
      title: "Usa il tuo WAV originale quando ce l'hai.",
      text: 'Un MP3 è una copia compressa, e ogni ulteriore giro di compressione perde dettaglio. Un audio più pulito dà meno errori.',
    },
    {
      title: 'Taglia le puntate molto lunghe in parti.',
      text: 'Un file più grande o più lungo dei limiti indicati in questa pagina non può essere elaborato, quindi dividi prima una puntata lunga con un qualsiasi editor audio.',
      browser: {
        title: 'Le puntate lunghe richiedono più tempo.',
        text: 'Il sito non impone alcun tetto alla durata delle puntate, ma un programma di conversazione lungo richiede tempo e memoria libera sul tuo dispositivo. Dividerlo in un punto naturale con un qualsiasi editor audio ti dà la prima parte prima.',
      },
    },
    {
      title: 'Leggi seguendo una volta.',
      text: 'Leggere la trascrizione mentre la puntata va a velocità normale è il modo più rapido per cogliere gli errori che contano.',
    },
    {
      title: "Di' che è automatica.",
      text: 'Se pubblichi una trascrizione senza una revisione completa, dillo, così i lettori sanno che sono possibili piccoli errori.',
    },
  ],

  faqs: [
    {
      question:
        'Posso pubblicare la trascrizione automatica di un podcast sulla pagina della mia puntata?',
      answer:
        "Sì, per una puntata che hai realizzato. Leggila prima per intero, correggi i nomi, aggiungi a mano i nomi dei parlanti e di' ai lettori che è stata creata automaticamente. Se un ospite ha chiesto di omettere qualcosa, rimuovilo anche dal testo.",
    },
    {
      question: 'La trascrizione del podcast ha i nomi dei parlanti?',
      answer:
        'No. Scrivi «Conduttore» e «Ospite» nel testo mentre modifichi; la trascrizione in sé porta solo i tempi.',
    },
    {
      question: 'Posso ottenere le note di puntata da una trascrizione di podcast?',
      answer:
        'Ottieni la materia prima, non un riassunto. La trascrizione non scrive le note di puntata al posto tuo, ma i suoi timestamp rendono rapido elencare gli argomenti e il minuto in cui inizia ciascuno.',
    },
    {
      question: 'Quanto può durare una puntata di podcast da trascrivere in una volta?',
      answer:
        "{limits} Una puntata lunga potrebbe dover essere divisa. Non c'è una quota giornaliera o mensile.",
      browser: {
        answer:
          'La durata della puntata non ha un tetto nel sito. Una puntata lunga richiede più tempo e memoria libera sul tuo dispositivo; la pagina ti avvisa su uno più lento.',
      },
    },
    {
      question: 'Posso trascrivere un podcast dal suo feed RSS o da un link?',
      answer:
        'No. TranscribeVid lavora con file che aggiungi, non con link web o feed. Usa il file della puntata che hai creato o esportato e aggiungilo nel riquadro in cima a questa pagina.',
    },
  ],

  links: [
    {
      label: 'MP3 in testo',
      path: '/mp3-to-text',
      note: 'Impostazioni e consigli per il tipo di file più comune dei podcast.',
    },
    {
      label: 'Generatore di sottotitoli SRT',
      path: '/srt-subtitle-generator',
      note: 'Didascalie per una versione video della puntata.',
    },
    {
      label: 'SRT o VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Quale file di didascalie si aspetta il tuo lettore o il tuo hosting.',
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Meno errori dalla stessa puntata.',
    },
  ],
};
