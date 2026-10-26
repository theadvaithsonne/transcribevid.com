import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 in testo',
  h1: 'Converti MP3 in testo online',
  lead: "Dalle puntate di podcast alle registrazioni di lezioni e ai messaggi vocali, l'MP3 è il formato audio di cui quasi tutti abbiamo cataste. Carica un MP3 e ottieni una trascrizione con timestamp gratis, senza registrazione.",
  dropKind: 'audio',
  dropNoun: 'il tuo file MP3',

  whyTitle: 'Cosa ti dà la trascrizione di un MP3',
  why: [
    "L'MP3 comprime l'audio in un file piccolo, ed è per questo che lo usano podcast, registratori vocali e lezioni scaricate. Qui aiuta anche: un MP3 si carica in fretta anche con una connessione lenta, e un MP3 di un'ora a 128 kbps pesa solo circa 58 MB.",
    'Una trascrizione ti permette di cercare una frase in una puntata lunga, citare esattamente un intervistato, scrivere le note di puntata senza riascoltare il programma o conservare una traccia scritta di un intervento o di un messaggio vocale.',
  ],
  browserWhy: [
    "L'MP3 comprime l'audio in un file piccolo, ed è per questo che lo usano podcast, registratori vocali e lezioni scaricate. Qui aiuta anche: il browser legge un MP3 in fretta, e un MP3 di un'ora a 128 kbps pesa solo circa 58 MB.",
    'Una trascrizione ti permette di cercare una frase in una puntata lunga, citare esattamente un intervistato, scrivere le note di puntata senza riascoltare il programma o conservare una traccia scritta di un intervento o di un messaggio vocale.',
  ],

  howTitle: 'Come convertire un MP3 in testo',
  howToDescription:
    "Carica l'MP3, scegli la lingua parlata, attendi la trascrizione e scaricala come testo o sottotitoli.",
  steps: [
    {
      title: 'Scegli il tuo MP3',
      text: 'Trascina il file .mp3 nel riquadro in cima a questa pagina oppure premi Scegli un file. Nel caricatore puoi aggiungerne più di uno e ognuno diventa una trascrizione a sé.',
    },
    {
      title: 'Scegli la lingua',
      text: "Seleziona la lingua parlata oppure lascia attivo il riconoscimento automatico. Per ottenere testo in inglese da un'altra lingua, apri Altre opzioni e imposta Risultato su Traduci in inglese.",
    },
    {
      title: 'Attendi la trascrizione',
      text: 'Il testo compare mentre il file viene elaborato, con una barra di avanzamento. Più veloce è rapido, Massima precisione richiede più tempo e commette meno errori.',
    },
    {
      title: 'Correggi e scarica',
      text: "Correggi qualsiasi riga, poi scarica il TXT da leggere, oppure SRT e VTT se l'audio fa parte di un video o di un lettore web.",
    },
  ],

  formatsTitle: 'MP3 e altri formati audio',
  formatsIntro:
    "L'MP3 è il file audio più comune. Questi altri formati audio funzionano allo stesso modo e sono accettati anche i file video.",
  uploadTitle: 'File audio che puoi caricare',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: "la puntata o l'intervento come testo semplice" },
    { name: 'Markdown', use: 'note di puntata con timestamp' },
    { name: 'SRT', use: 'didascalie per una versione video' },
    { name: 'VTT', use: 'una traccia di trascrizione per i lettori web' },
    { name: 'PDF', use: 'una trascrizione da stampare o inviare' },
    { name: 'JSON', use: 'righe strutturate per i programmi' },
  ],

  tipsTitle: 'Consigli per trascrivere file MP3',
  tips: [
    {
      title: 'Carica la copia migliore.',
      text: "L'MP3 è con perdita e ogni nuovo salvataggio perde un po' più di dettaglio. Se hai ancora il WAV o la registrazione originale, carica quello.",
    },
    {
      title: 'Evita bitrate molto bassi.',
      text: 'Il parlato resiste bene alla compressione, ma bitrate molto bassi impastano le consonanti e riducono la precisione.',
    },
    {
      title: 'Dividi le puntate lunghe.',
      text: 'Un file oltre il limite di durata viene rifiutato. Taglia prima una puntata di due ore in parti con un qualsiasi editor audio.',
      browser: {
        text: "Non c'è un limite di durata, ma una puntata di due ore richiede un po' di tempo su un dispositivo più lento. Tagliala in parti con un qualsiasi editor audio per leggere prima la prima parte.",
      },
    },
    {
      title: 'Gestisci sigle e musica.',
      text: "Tieni attiva l'opzione Salta silenzi e musica in Altre opzioni, così jingle e pause lunghe non producono parole inventate.",
    },
    {
      title: 'Scrivi correttamente gli ospiti.',
      text: 'Inserisci una sola volta conduttore, ospiti, nome del programma e marchi nel suggerimento di vocabolario: sarà molto più probabile che vengano scritti bene.',
    },
  ],

  faqs: [
    {
      question: 'Quanto può durare un MP3?',
      answer:
        "{limits} Un MP3 di 60 minuti a 128 kbps pesa circa 58 MB, quindi il limite di durata conta più di quello di dimensione. Non c'è una quota giornaliera o mensile.",
      browser: {
        answer:
          "Non impostiamo alcun limite di dimensione o durata, perché l'MP3 viene trascritto nel browser, sul tuo dispositivo. Un MP3 di 60 minuti a 128 kbps pesa circa 58 MB; i file più lunghi richiedono semplicemente più tempo e la pagina ti avvisa su un dispositivo più lento. Non c'è una quota giornaliera o mensile.",
      },
    },
    {
      question: 'La compressione MP3 danneggia la precisione?',
      answer:
        "Non molto con una qualità normale, perché il parlato è il caso facile per l'MP3. Rumore, eco e voci sovrapposte pesano molto più del formato, quindi se hai un originale pulito preferiscilo.",
    },
    {
      question: 'Posso trascrivere più file MP3 insieme?',
      answer:
        'Sì. Aggiungili insieme e ognuno diventa una trascrizione a sé nella tua sessione, che puoi aprire e scaricare separatamente.',
    },
    {
      question: 'Posso tradurre un MP3 in inglese?',
      answer:
        'Sì. In Altre opzioni imposta Risultato su Traduci in inglese. La traduzione è automatica, quindi leggi il testo inglese prima di usarlo. Non sono offerte altre lingue di destinazione.',
    },
    {
      question: 'Il mio MP3 viene conservato?',
      answer:
        'Solo per la tua sessione. Viene cancellato automaticamente quando la sessione termina, oppure quando premi Elimina ora i miei dati. Non serve alcun account.',
      browser: {
        answer:
          'Solo in questo browser: il tuo MP3 non lascia mai il tuo dispositivo. Viene cancellato automaticamente dopo un periodo di inattività, oppure quando premi Elimina ora i miei dati. Non serve alcun account.',
      },
    },
  ],
};
