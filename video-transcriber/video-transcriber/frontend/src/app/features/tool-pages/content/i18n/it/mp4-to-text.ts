import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 in testo',
  h1: 'Trascrivi un video MP4 in testo',
  lead: "L'MP4 è il formato delle fotocamere dei telefoni, dei registratori dello schermo e delle esportazioni delle riunioni. Carica il tuo e ottieni una trascrizione con timestamp, gratis e senza registrazione.",
  dropKind: 'video',
  dropNoun: 'il tuo file MP4',

  whyTitle: 'Perché i file MP4 sono facili da trascrivere',
  why: [
    "Un MP4 è un contenitore: tiene insieme immagine e audio. TranscribeVid legge l'audio e ignora l'immagine, quindi non c'è nulla da convertire prima e non serve un passaggio separato da MP4 a MP3.",
    'Si adatta alle registrazioni che nascono già come MP4, come video del telefono, riunioni Zoom o Teams salvate, registrazioni dello schermo, webinar e registrazioni di lezioni. Il risultato è testo con un orario su ogni riga, pronto da cercare o da trasformare in sottotitoli.',
  ],

  howTitle: 'Come convertire un MP4 in testo',
  howToDescription:
    "Carica l'MP4, scegli la lingua parlata e la qualità, attendi la trascrizione e scaricala.",
  steps: [
    {
      title: "Trova l'MP4",
      text: 'Individua il file .mp4 sul telefono o sul computer. Non serve comprimerlo o tagliarlo, a meno che superi il limite.',
      browser: {
        text: 'Individua il file .mp4 sul telefono o sul computer. Non serve comprimerlo o tagliarlo prima.',
      },
    },
    {
      title: 'Caricalo',
      text: "Trascina l'MP4 nel riquadro in cima a questa pagina oppure premi Scegli un file. Nel caricatore puoi mettere in coda più file MP4 contemporaneamente.",
      browser: {
        title: 'Aggiungilo',
        text: "Trascina l'MP4 nel riquadro in cima a questa pagina oppure premi Scegli un file. Nel caricatore puoi aggiungere più file MP4; vengono trascritti uno dopo l'altro.",
      },
    },
    {
      title: 'Scegli lingua e qualità',
      text: 'Scegli la lingua parlata. Si consiglia Standard. Alta precisione e Massima precisione sono più lente e commettono meno errori, mentre Più veloce è rapido con un parlato chiaro.',
    },
    {
      title: 'Scarica il risultato',
      text: 'Ottieni un TXT da leggere, un SRT o VTT da usare come sottotitoli con lo stesso MP4, oppure un PDF da stampare.',
    },
  ],

  formatsTitle: 'MP4 e altri formati video',
  formatsIntro:
    "L'MP4 è il caso più comune, ma lo stesso caricamento accetta questi tipi di video e anche i normali formati audio.",
  uploadTitle: 'File video che puoi caricare',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'le parole pronunciate come testo semplice' },
    { name: 'SRT', use: 'un file di sottotitoli per lo stesso MP4' },
    { name: 'VTT', use: 'sottotitoli per una pagina web' },
    { name: 'PDF', use: 'una trascrizione da stampare o condividere' },
    { name: 'Markdown', use: 'appunti con i tempi' },
    { name: 'JSON', use: 'dati per i tuoi strumenti' },
  ],

  tipsTitle: 'Consigli per trascrivere file MP4',
  tips: [
    {
      title: "Controlla che ci sia l'audio.",
      text: 'Una registrazione dello schermo fatta senza audio non ha parlato da trascrivere e dà un risultato vuoto.',
    },
    {
      title: 'Attenzione al vento e alla stanza.',
      text: 'I video del telefono soffrono di vento, distanza ed eco. Tieni il telefono più vicino, oppure la prossima volta aggiungi un microfono esterno.',
    },
    {
      title: "Riduci i file grandi esportando l'audio.",
      text: "Se un MP4 supera il limite, esporta solo l'audio (M4A o MP3) dal tuo editor. È molto più piccolo e funziona allo stesso modo.",
      browser: {
        text: "Un MP4 molto lungo richiede molta memoria su un telefono. Esporta solo l'audio (M4A o MP3) dal tuo editor: è molto più piccolo e funziona allo stesso modo.",
      },
    },
    {
      title: "Tieni l'SRT accanto al video.",
      text: 'Molti lettori caricano automaticamente un file .srt quando ha lo stesso nome del video.',
    },
    {
      title: 'Controlla nomi e numeri.',
      text: 'Le trascrizioni automatiche sbagliano più spesso proprio questi. Cerca e sostituisci correggono le ripetizioni in un colpo solo.',
    },
  ],

  faqs: [
    {
      question: "Devo prima convertire l'MP4 in MP3?",
      answer: "No. Carica l'MP4 così com'è. L'audio viene letto dal file al posto tuo.",
    },
    {
      question: 'Perché il mio MP4 è stato rifiutato?',
      answer:
        "I file oltre il limite di dimensione o durata vengono rifiutati prima dell'elaborazione. {limits} Dividi il video in parti oppure esporta solo l'audio, poi carica di nuovo.",
      browser: {
        question: 'Perché il mio MP4 non ha funzionato?',
        answer:
          "Il browser non è riuscito a leggerne l'audio: il file potrebbe essere danneggiato, non avere una traccia audio o usare un formato audio raro. Esporta l'audio come M4A o MP3 dal tuo editor e aggiungi quel file. Non c'è un limite di dimensione o durata, ma i video molto lunghi richiedono abbastanza memoria libera.",
      },
    },
    {
      question: 'Posso aggiungere sottotitoli al mio MP4 con questo strumento?',
      answer:
        "Ottieni un file di sottotitoli (SRT o VTT) temporizzato sul parlato. TranscribeVid non modifica né ricodifica il tuo MP4, quindi per incorporare i sottotitoli nell'immagine serve un editor video.",
    },
    {
      question: 'Posso incollare un link invece di caricare?',
      answer:
        'No. TranscribeVid lavora con file che carichi o registri, non con link web. Se il video è tuo, carica il file originale.',
    },
    {
      question: 'Funziona con Zoom, Teams e video del telefono?',
      answer:
        'Sì, qualsiasi MP4 con parlato funziona. Nelle riunioni non vengono aggiunti i nomi dei parlanti, ma le righe hanno un timestamp, così puoi aggiungere i nomi mentre modifichi.',
    },
  ],
};
