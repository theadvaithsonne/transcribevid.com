import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Generatore di sottotitoli per YouTube',
  h1: 'Crea i sottotitoli per il tuo video di YouTube',
  lead: 'Aggiungi il file video che hai creato per YouTube, ottieni un file SRT temporizzato sul parlato e caricalo in YouTube Studio. Gratis, senza registrazione, e controlli ogni riga prima di pubblicare.',
  dropKind: 'video',
  dropNoun: 'il tuo video',

  whyTitle: 'Perché caricare un file di sottotitoli tuo',
  why: [
    'YouTube crea sottotitoli automatici per molti video, ma non sono sempre corretti e non compaiono finché YouTube non ha finito di elaborare il video. Un file di sottotitoli tuo ti permette di controllare e correggere ogni riga, con i tuoi nomi, prodotti e termini scritti come li scrivi tu.',
    "Questa pagina è per i video che hai realizzato tu. Funziona a partire dal file video sul tuo computer, non da un link di YouTube: incollare un link non è supportato. Se il video è tuo, hai già l'originale dalla fotocamera o dall'editor. TranscribeVid è uno strumento indipendente e non è collegato a YouTube: non accede mai al tuo canale, quindi il file finito lo aggiungi lì tu stesso.",
  ],

  sections: [
    {
      title: 'Aggiungere il file SRT in YouTube Studio',
      paragraphs: [
        'I nomi dei menu in YouTube Studio cambiano di tanto in tanto, quindi considera questi passaggi una guida e segui le etichette che vedi sullo schermo.',
      ],
      bullets: [
        {
          title: 'Apri Sottotitoli.',
          text: 'Accedi al tuo canale, apri YouTube Studio e scegli Sottotitoli dal menu a sinistra.',
        },
        {
          title: 'Scegli il video.',
          text: 'Scegli il video a cui vuoi aggiungere i sottotitoli. Se YouTube ti chiede la lingua del video, impostala prima.',
        },
        {
          title: 'Aggiungi la lingua.',
          text: 'Scegli Aggiungi lingua, seleziona la lingua del file, poi scegli Aggiungi sotto Sottotitoli.',
        },
        {
          title: 'Carica il file.',
          text: "Scegli Carica file, poi Con temporizzazione, e seleziona il file .srt che hai scaricato. Controlla le righe nell'anteprima, poi Pubblica.",
        },
      ],
    },
    {
      title: "Sottotitoli in inglese da un'altra lingua",
      paragraphs: [
        "Se il video è parlato in un'altra lingua, imposta Risultato su Traduci in inglese in Altre opzioni prima di iniziare. Ottieni testo inglese temporizzato sul parlato, che puoi caricare come traccia di sottotitoli in inglese. La traduzione è un lavoro automatico, quindi leggi l'inglese per intero prima che vada online.",
        "TranscribeVid non traduce in lingue diverse dall'inglese. Per ogni altra lingua di cui hai un file, aggiungi una traccia separata in YouTube Studio.",
      ],
    },
    {
      title: 'Perché i sottotitoli valgono lo sforzo',
      paragraphs: [
        'Le persone guardano video in luoghi dove non possono alzare il volume, e molte seguono una seconda lingua meglio per iscritto che a orecchio. I sottotitoli aiutano anche gli spettatori sordi o con problemi di udito, e trasformano le tue parole in testo che si può cercare e citare.',
      ],
    },
  ],

  howTitle: 'Come creare i sottotitoli per un video di YouTube',
  howToDescription:
    'Aggiungi il file video, scegli la lingua parlata, controlla le righe, scarica un file SRT e caricalo in YouTube Studio.',
  steps: [
    {
      title: 'Aggiungi il tuo file video',
      text: 'Scegli il file video che hai caricato su YouTube, non un link: trascinalo sul riquadro in cima a questa pagina oppure premi Scegli un file. Per un secondo video, usa Aggiungi un altro file nella pagina successiva.',
    },
    {
      title: 'Scegli la lingua',
      text: 'Nella pagina successiva scegli la lingua parlata, oppure lascia attivo Rileva automaticamente. Tieni attivi i Tempi per parola in Altre opzioni, così ogni riga inizia e finisce con le parole. Poi premi Trascrivi.',
    },
    {
      title: 'Controlla le righe',
      text: 'Apri la trascrizione, riproduci da qualsiasi timestamp e correggi parole, nomi e numeri sbagliati. Elimina le righe che non vuoi mostrare.',
    },
    {
      title: "Scarica l'SRT e caricalo",
      text: 'Scarica il file SRT, poi aggiungilo al video in YouTube Studio come descritto sopra.',
    },
  ],

  formatsTitle: 'File video e file di sottotitoli',
  formatsIntro:
    'Aggiungi il file video che hai creato per YouTube, in uno qualsiasi di questi tipi, e scarica i sottotitoli nel formato che ti serve.',
  uploadTitle: 'File video che puoi aggiungere',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'il file di sottotitoli che chiede YouTube Studio' },
    { name: 'VTT', use: 'WebVTT, per i lettori web' },
    { name: 'TXT', use: 'una trascrizione per la descrizione o un articolo di blog' },
    { name: 'Markdown', use: 'testo con timestamp' },
    { name: 'JSON', use: 'ogni riga e ogni tempo, per i programmi' },
    { name: 'PDF', use: 'un copione stampabile' },
  ],

  tipsTitle: 'Consigli per i sottotitoli di YouTube',
  tips: [
    {
      title: 'Usa il montaggio finale.',
      text: 'Crea il file dal video esatto che carichi, non da una bozza precedente. Ogni modifica che sposta il parlato sposta anche la temporizzazione.',
    },
    {
      title: 'Tieni attivi i tempi per parola.',
      text: 'È attivo per impostazione predefinita e dà una temporizzazione dei sottotitoli più precisa rispetto alla temporizzazione di frasi intere.',
    },
    {
      title: 'Correggi i nomi prima di pubblicare.',
      text: 'Il testo automatico sbaglia più spesso nomi di canali, prodotti e numeri. Un suggerimento di vocabolario aiuta, e una rilettura prende il resto.',
    },
    {
      title: "Leggilo con l'audio spento.",
      text: 'Guarda il video senza audio con i sottotitoli attivi. Vedrai subito quali righe spariscono troppo in fretta per essere lette.',
    },
  ],

  faqs: [
    {
      question: 'Posso creare sottotitoli per un video di YouTube che non ho caricato io?',
      answer:
        "No. Questo strumento funziona solo con file, non con link, ed è pensato per i video che hai realizzato tu o che hai il diritto di usare. Per i tuoi video, usa il file originale della fotocamera o dell'editor.",
    },
    {
      question: 'Quale file vuole YouTube Studio, SRT o VTT?',
      answer:
        "L'SRT è la scelta più sicura: è un formato molto diffuso che YouTube Studio legge. Caricalo con la temporizzazione, così le righe corrispondono al parlato.",
    },
    {
      question: 'Devo accedere per creare il file di sottotitoli?',
      answer:
        'No. Qui non serve alcun account. Ti serve il tuo canale YouTube solo per caricare il file in YouTube Studio.',
    },
    {
      question: 'Come ottengo sottotitoli in inglese per un video in spagnolo o in hindi?',
      answer:
        'Imposta Risultato su Traduci in inglese in Altre opzioni prima di iniziare. La trascrizione esce in inglese con i tempi. La traduzione è automatica e può contenere errori, quindi leggila prima di pubblicarla come traccia in inglese.',
    },
    {
      question: 'Perché i miei sottotitoli sono sfasati su YouTube?',
      answer:
        "Molto spesso il file è stato creato da una versione diversa del video, per esempio prima che l'inizio fosse tagliato. Crea di nuovo il file dal video esatto che hai caricato. La temporizzazione è vicina ma non precisa al fotogramma, quindi un controllo finale in YouTube Studio aiuta.",
    },
  ],

  links: [
    {
      label: 'Generatore di sottotitoli SRT',
      path: '/srt-subtitle-generator',
      note: "Com'è fatto dentro un file SRT, e come correggere le righe prima di esportare.",
    },
    {
      label: 'Come aggiungere sottotitoli a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Altri posti in cui usare il file: lettori multimediali, editor e la tua pagina web.',
    },
    {
      label: 'Traduci il parlato in inglese',
      path: '/translate-audio-to-english',
      note: "Testo inglese da un parlato in un'altra lingua, e cosa controllare dopo.",
    },
    {
      label: 'SRT o VTT: quale formato di sottotitoli usare',
      path: '/guides/srt-vs-vtt',
      note: 'In cosa differiscono i due formati di sottotitoli più comuni.',
    },
  ],
};
