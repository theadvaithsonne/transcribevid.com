import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV in testo',
  h1: 'Converti un file WAV in testo, gratis e con timestamp',
  lead: 'WAV è il formato dei registratori portatili, dei registratori di chiamate e delle sessioni in studio. Aggiungi il tuo e leggi le parole come testo con timestamp, gratis, senza registrazione e senza bisogno di comprimere prima il file.',
  dropKind: 'audio',
  dropNoun: 'il tuo file WAV',

  whyTitle: 'Perché un file WAV è ottimo da trascrivere',
  why: [
    "Un file WAV di solito conserva il suono senza compressione, quindi nulla è andato perso al momento del salvataggio. È un'ottima fonte per il riconoscimento vocale: nessun artefatto di compressione e ogni consonante è ancora nel file. Non serve trasformarlo prima in MP3. TranscribeVid legge il WAV così com'è.",
    "Il prezzo di questa qualità è la dimensione. Lo stereo in qualità CD occupa circa 10 MB al minuto, quindi un'ora di audio supera mezzo gigabyte. Questa pagina è fatta per questi file grandi: salta il silenzio e la maggior parte dei suoni che non sono parlato (l'opzione Salta silenzi e musica, attiva per impostazione predefinita) e ti dà testo con un timestamp su ogni riga.",
  ],

  sections: [
    {
      title: 'Da dove arrivano le registrazioni WAV',
      paragraphs: [
        'Il WAV è lo standard di fatto del mondo audio, quindi il file che hai davanti probabilmente arriva da una di queste fonti.',
      ],
      bullets: [
        {
          title: 'Registratori portatili.',
          text: 'I registratori portatili usati per interviste, lezioni e appunti sul campo spesso salvano in WAV, perché conserva ogni dettaglio del suono.',
        },
        {
          title: 'Registratori di chiamate e riunioni.',
          text: "Gli strumenti di registrazione delle chiamate e i sistemi di conferenza spesso esportano in WAV. Se ogni lato di una chiamata si trova su un canale a parte, i due vengono mescolati in un'unica trascrizione.",
        },
        {
          title: 'Editor audio.',
          text: 'Programmi come Audacity e Adobe Audition esportano in WAV quando salvi o esporti un progetto, il che lo rende il file naturale da passare per la trascrizione.',
        },
        {
          title: 'Dispositivi per dettatura.',
          text: 'Alcuni registratori di dettatura digitali scrivono file WAV che puoi copiare direttamente dal dispositivo.',
        },
      ],
    },
    {
      title: 'Frequenza di campionamento, profondità di bit e canali',
      paragraphs: [
        "Non serve preparare un WAV prima di aggiungerlo. Le impostazioni più comuni vengono lette tutte: 8, 16 o 24 bit, oppure 32 bit in virgola mobile, mono o stereo, a 44,1 o 48 kHz. L'audio viene ridotto a mono e convertito automaticamente per il modello vocale.",
        'Una frequenza di campionamento più alta non rende la trascrizione più accurata, perché il parlato si trova nella parte bassa dello spettro sonoro. Conta molto di più dove metti il microfono che i numeri del file.',
        "Migliora l'audio, in Altre opzioni, filtra rimbombi e fruscii e uniforma i parlanti a voce bassa. È attivo per impostazione predefinita e si fa valere su una registrazione fatta vicino a un ventilatore, a una strada o a un condizionatore.",
      ],
    },
  ],

  howTitle: 'Come convertire un file WAV in testo',
  howToDescription:
    'Aggiungi il file WAV, scegli la lingua parlata e la qualità, attendi la trascrizione e scaricala come testo o sottotitoli.',
  steps: [
    {
      title: 'Inserisci il WAV',
      text: 'Aggiungi il file .wav nel riquadro in cima a questa pagina: trascinalo lì oppure premi Scegli un file. Se è ancora su un registratore, copialo prima sul computer. Il riquadro accetta un solo file; nella pagina successiva, Aggiungi un altro file mette in coda altri WAV e ognuno ottiene la propria trascrizione.',
    },
    {
      title: 'Scegli lingua e qualità',
      text: 'Nella pagina successiva scegli la lingua parlata, oppure lascia Rileva automaticamente per una registrazione in una sola lingua. Standard va bene per la maggior parte del parlato. Per una registrazione silenziosa o difficile, Alta precisione e Massima precisione richiedono più tempo e commettono meno errori. Poi premi Trascrivi.',
      browser: {
        text: 'Nella pagina successiva scegli la lingua parlata, oppure lascia Rileva automaticamente per una registrazione in una sola lingua. Standard va bene per la maggior parte del parlato. Per una registrazione silenziosa o difficile, prova Alta precisione o Massima precisione se il tuo dispositivo le offre: richiedono più tempo, sono un download iniziale più grande e sono disattivate, con il motivo, su un dispositivo che non può eseguirle. Poi premi Trascrivi.',
      },
    },
    {
      title: 'Guarda comparire il testo',
      text: 'La trascrizione si riempie riga per riga, ognuna con il proprio orario. Riproduci da qualsiasi riga per confrontarla con la registrazione.',
    },
    {
      title: 'Modifica e scarica',
      text: 'Correggi le parole sbagliate, poi scarica TXT da leggere, SRT o VTT per i sottotitoli, oppure PDF da stampare. Al termine della sessione non viene conservato nulla, quindi salva ciò che ti serve.',
    },
  ],

  formatsTitle: 'WAV e altri formati audio',
  formatsIntro:
    'WAV è il formato senza perdita, e questo riquadro accetta anche questi tipi di audio.',
  uploadTitle: 'File audio che puoi aggiungere',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'le parole come testo semplice' },
    { name: 'SRT', use: 'righe di sottotitoli temporizzate' },
    { name: 'VTT', use: 'righe temporizzate per i lettori web' },
    { name: 'PDF', use: 'una copia stampabile' },
    { name: 'Markdown', use: 'appunti con i tempi' },
    { name: 'JSON', use: 'dati per i tuoi strumenti' },
  ],

  tipsTitle: 'Consigli per trascrivere registrazioni WAV',
  tips: [
    {
      title: "Aggiungilo esattamente così com'è.",
      text: 'Convertire prima un WAV non porta alcun vantaggio, e un MP3 a basso bitrate può perdere dettaglio. Aggiungi il file così come è uscito dal registratore.',
    },
    {
      title: 'Ascolta entrambi i canali.',
      text: "Lo stereo viene ridotto a mono. Se un microfono è molto più basso o rumoroso dell'altro, il mix lo eredita, quindi controlla entrambi i canali nel tuo lettore prima di un lavoro lungo.",
    },
    {
      title: 'Taglia i silenzi lunghi.',
      text: 'Le registrazioni sul campo spesso iniziano e finiscono con minuti di nulla. Tagliarli in un editor rende il file più piccolo, e la trascrizione parte da dove si comincia a parlare.',
    },
    {
      title: 'Dividi una sessione molto lunga.',
      text: 'Le registrazioni oltre il limite di dimensione o durata vengono rifiutate, quindi dividi una sessione lunga in un punto naturale e trascrivi le parti.',
      browser: {
        title: 'Diverse ore richiedono diverse ore.',
        text: 'Il sito non impone alcun limite di dimensione o durata, ma una registrazione di diverse ore richiede molto tempo e molta memoria libera, e un browser più vecchio può rifiutare un file molto lungo. Su un telefono, dividila in un punto naturale e trascrivi le parti.',
      },
    },
    {
      title: 'Scrivi le parole difficili.',
      text: 'Elenca nomi, luoghi e termini tecnici nel suggerimento di vocabolario in Altre opzioni, scritti come vuoi vederli.',
    },
  ],

  faqs: [
    {
      question: 'Posso trascrivere un WAV registrato durante una telefonata?',
      answer:
        "Sì, se la chiamata è salvata come file WAV e si sentono entrambe le persone. I due canali vengono mescolati in un'unica trascrizione e i nomi dei parlanti non vengono aggiunti, quindi scrivili nel testo mentre modifichi. Di' alle persone che stai registrando e controlla le regole del posto in cui vivi prima di registrare le chiamate.",
    },
    {
      question: "Il WAV è più accurato dell'MP3 per la trascrizione?",
      answer:
        "Può aiutare un po', perché dal suono non è stato tolto nulla. Ma un MP3 chiaro di solito si trascrive bene e un WAV rumoroso no. Contano più il microfono, la stanza e la vicinanza di chi parla che il formato del file.",
    },
    {
      question: 'Perché il mio file WAV è così grande, e importa?',
      answer:
        'Il WAV di solito conserva il suono senza compressione: circa 10 MB al minuto per lo stereo in qualità CD. I file grandi richiedono più tempo per essere letti. {limits} Se un file supera il limite, accorcialo, oppure esporta una copia compressa (M4A o MP3) e usa quella.',
      browser: {
        answer:
          "Il WAV di solito conserva il suono senza compressione: circa 10 MB al minuto per lo stereo in qualità CD. I file grandi richiedono un po' più di tempo per essere letti, ma il formato non è il problema: nei test un file di circa 2,5 GB è stato letto senza difficoltà in un browser aggiornato. Il sito non impone alcun limite di dimensione o durata perché il lavoro lo fa il tuo dispositivo, quindi una registrazione molto lunga richiede tempo e memoria libera, e un browser più vecchio può rifiutare un file molto lungo. Su un telefono, dividilo prima.",
      },
    },
    {
      question: 'Gestisce file WAV a 24 bit e 48 kHz?',
      answer:
        "Sì. Le impostazioni WAV più comuni, come 16 o 24 bit a 44,1 o 48 kHz, vengono lette senza alcuna preparazione e l'audio viene convertito automaticamente per il modello vocale.",
    },
    {
      question: 'Posso trascrivere più file WAV in una volta?',
      answer:
        "Sì, nella pagina successiva. Il riquadro di questa pagina accetta un solo file; lì, Aggiungi un altro file mette in coda gli altri. Ogni file ottiene la propria trascrizione, quindi un'intera giornata di registrazioni può essere elaborata una dopo l'altra.",
    },
  ],

  links: [
    {
      label: 'MP3 in testo',
      path: '/mp3-to-text',
      note: 'La stessa trascrizione gratuita per il formato compresso in cui finiscono molte registrazioni vocali.',
    },
    {
      label: 'Trascrizione di interviste',
      path: '/interview-transcription',
      note: 'Consigli per trasformare le registrazioni di interviste in una trascrizione pulita e citabile.',
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Cosa cambiare nella registrazione, nella lingua e nelle impostazioni quando il primo risultato non è abbastanza buono.',
    },
    {
      label: 'Registrazioni di riunioni in testo',
      path: '/meeting-recording-to-text',
      note: 'Per le conferenze telefoniche salvate come registrazione.',
    },
  ],
};
