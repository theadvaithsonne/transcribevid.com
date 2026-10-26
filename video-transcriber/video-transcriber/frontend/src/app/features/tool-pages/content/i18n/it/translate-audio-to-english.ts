import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Traduci il parlato in inglese',
  h1: 'Traduci il parlato in testo e sottotitoli in inglese',
  lead: "Aggiungi un file video o audio in un'altra lingua e ottieni testo inglese con timestamp, oppure un file di sottotitoli in inglese. Gratis, senza registrazione.",
  dropKind: 'video',
  dropNoun: 'il tuo video o audio',

  whyTitle: 'Cosa fa la traduzione del parlato in inglese',
  why: [
    "La maggior parte del riconoscimento vocale scrive ciò che è stato detto nella lingua in cui è stato detto. Tradurre in inglese è un lavoro diverso. Chi parla usa hindi, spagnolo, tedesco o un'altra lingua supportata, e il testo esce in inglese, con un timestamp su ogni riga. Serve quando ti occorre il senso di una lezione, di un'intervista, di un servizio di notizie o di un video di famiglia che non riesci a seguire, oppure sottotitoli in inglese per un video in un'altra lingua.",
    "L'inglese è l'unica lingua in cui traduce. Non c'è traduzione in francese, hindi o altre lingue, e il testo scritto non viene tradotto: solo il parlato della registrazione. Questa pagina avvia il caricatore con Risultato impostato su Traduci in inglese e la lingua parlata lasciata su Rileva automaticamente.",
  ],

  sections: [
    {
      title: "Quanto è affidabile l'inglese e cosa controllare",
      paragraphs: [
        "Tradurre è più difficile che trascrivere. L'inglese viene prodotto direttamente dal suono, senza testo scritto nella lingua originale in mezzo. Spesso è abbastanza buono per seguire il significato, ma può accorciare o riformulare le frasi, perdere modi di dire e battute e sbagliare nomi, numeri e parole tecniche.",
        'Considera il risultato una bozza per capire, non una traduzione ufficiale. Per contratti, materiale legale, medico o altro materiale importante, rivolgiti a un traduttore umano e usa una trascrizione nella lingua originale come punto di partenza.',
        'Una buona abitudine è creare prima una normale trascrizione nella lingua originale e poi la versione inglese. Dove le due sembrano non concordare, quel punto merita un ascolto più attento. Una trascrizione finita viene conservata quando usi Trascrivi di nuovo, quindi entrambe possono provenire dallo stesso file.',
      ],
    },
    {
      title: 'Quali lingue e quali scelte di qualità traducono bene',
      bullets: [
        {
          title: "Qualsiasi lingua dell'elenco.",
          text: "Più di 50 lingue parlate, dall'afrikaans al gallese, possono essere tradotte in inglese. La qualità varia molto ed è più debole per le lingue che hanno poco parlato registrato da cui imparare. Se il parlato è già in inglese, questa pagina non ti serve: usa le pagine da video a testo o da audio a testo.",
        },
        {
          title: 'Indica la lingua, oppure lasciala rilevare.',
          text: 'Lascia Lingua su Rileva automaticamente quando non sei sicuro di cosa venga parlato. Se la conosci, sceglierla è più affidabile, soprattutto per clip brevi o con accento.',
        },
        {
          title: 'Evita Alta precisione per la traduzione.',
          text: "Alta precisione esegue il modello Large v3 Turbo. OpenAI, che ha creato Whisper, dice che Turbo non è addestrato per la traduzione e restituisce la lingua originale anche quando viene richiesta la traduzione. Distil Large v3, nell'elenco Modello sotto Altre opzioni, è solo inglese. Per una traduzione, inizia con Standard, e scegli Massima precisione (Large v3) per un parlato difficile. Medium, anch'esso in quell'elenco Modello, è un'altra scelta valida.",
          browser: {
            text: "Alta precisione esegue il modello Large v3 Turbo. OpenAI, che ha creato Whisper, dice che Turbo non è addestrato per la traduzione e restituisce la lingua originale anche quando viene richiesta la traduzione. Distil Large v3, nell'elenco Modello sotto Altre opzioni, è solo inglese. Per una traduzione, inizia con Standard, e scegli Massima precisione (Large v3) per un parlato difficile se il tuo dispositivo la offre. Medium, anch'esso in quell'elenco Modello, è un'altra scelta valida.",
          },
        },
        {
          title: 'Solo Whisper.',
          text: 'Tradurre richiede il motore di riconoscimento Whisper. La scelta sperimentale Qwen3 ASR non può tradurre: Traduci in inglese non è disponibile mentre è selezionata, e sceglierla riporta Risultato su Trascrivi.',
        },
        {
          title: 'Nessuno stile della trascrizione.',
          text: 'La scelta Stile della trascrizione (Hinglish o Scrittura originale) non si applica a una traduzione ed è disattivata mentre Traduci in inglese è selezionato.',
        },
      ],
    },
    {
      title: 'Cosa fanno le persone con sottotitoli e testo in inglese',
      bullets: [
        {
          title: 'Sottotitoli per il tuo video.',
          text: 'Scarica SRT o VTT. Le righe in inglese sono temporizzate sul parlato originale, quindi possono essere aggiunte allo stesso video in un lettore o in un editor.',
        },
        {
          title: 'Capire una registrazione.',
          text: "Leggi di cosa parla un'intervista, una lezione o un servizio di notizie prima di decidere se serve una traduzione vera e propria.",
        },
        {
          title: 'Ricerca e giornalismo.',
          text: 'Una bozza in inglese ti aiuta a decidere quali passaggi far tradurre con cura e quali citare nella lingua originale.',
        },
      ],
    },
  ],

  howTitle: 'Come tradurre il parlato in inglese',
  howToDescription:
    "Aggiungi un file video o audio in un'altra lingua, verifica che Traduci in inglese sia selezionato, attendi il testo inglese e scaricalo.",
  steps: [
    {
      title: 'Aggiungi la tua registrazione',
      text: 'Trascina la tua registrazione sul riquadro in cima a questa pagina, oppure premi Scegli un file. Arrivi nel caricatore con Altre opzioni aperte, Risultato impostato su Traduci in inglese e Lingua su Rileva automaticamente. Scegli la lingua parlata se la conosci.',
    },
    {
      title: 'Scegli la qualità, poi premi Trascrivi',
      text: 'Standard è un buon inizio. Per un parlato con accento, rumoroso o tecnico scegli Massima precisione, che richiede più tempo e di solito commette meno errori. Non scegliere Alta precisione per una traduzione: usa un modello che non è stato addestrato a tradurre. Poi premi Trascrivi.',
      browser: {
        text: 'Standard è un buon inizio. Per un parlato con accento, rumoroso o tecnico scegli Massima precisione se il tuo dispositivo la offre (una scelta che non può eseguire è disattivata, con il motivo); è un download iniziale grande, richiede più tempo e di solito commette meno errori. Non scegliere Alta precisione per una traduzione: usa un modello che non è stato addestrato a tradurre. Poi premi Trascrivi.',
      },
    },
    {
      title: 'Attendi il testo inglese',
      text: 'Le righe in inglese compaiono con i loro tempi. Stile della trascrizione è disattivato perché si applica solo alle trascrizioni, non alle traduzioni.',
    },
    {
      title: 'Controlla e scarica',
      text: "Leggi le righe segnalate come incerte, confronta nomi e numeri con l'audio, poi scarica TXT, SRT o VTT, oppure un file PDF, Markdown o JSON.",
    },
  ],

  formatsTitle: 'File in ingresso, testo inglese in uscita',
  formatsIntro:
    'Funzionano video e audio in molti formati, qualunque sia la lingua parlata. I file che scarichi contengono il testo inglese.',
  uploadTitle: 'File che puoi aggiungere',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'testo inglese da leggere' },
    { name: 'SRT', use: 'sottotitoli in inglese temporizzati sul parlato' },
    { name: 'VTT', use: 'sottotitoli in inglese per un lettore web' },
    { name: 'PDF', use: 'una copia stampabile' },
    { name: 'Markdown', use: 'testo con titoli e tempi' },
    { name: 'JSON', use: 'righe e tempi per i tuoi strumenti' },
  ],

  tipsTitle: 'Consigli per traduzioni migliori',
  tips: [
    {
      title: 'Indica la lingua parlata quando la conosci.',
      text: "Il riconoscimento automatico va bene per un parlato chiaro, ma un'ipotesi sbagliata su una clip breve dà una traduzione scadente.",
    },
    {
      title: 'Tieni le clip in una sola lingua.',
      text: "Una registrazione che passa di continuo da una lingua all'altra può confondere la traduzione. Dividila, oppure crea prima una normale trascrizione per vedere cosa è stato sentito.",
    },
    {
      title: 'Controlla numeri, nomi e date.',
      text: 'Sono i dettagli che contano di più e quelli più spesso sbagliati in una bozza tradotta.',
    },
    {
      title: 'Prova il primo minuto.',
      text: "Leggi il primo minuto di inglese confrontandolo con l'audio prima di fare affidamento sull'intero file.",
    },
    {
      title: "Tieni l'originale accanto all'inglese.",
      text: 'Se pubblichi una citazione, tieni la trascrizione nella lingua originale accanto alla versione inglese.',
    },
  ],

  faqs: [
    {
      question: "Può tradurre il parlato in lingue diverse dall'inglese?",
      answer:
        "No. L'inglese è l'unica lingua in cui traduce. Per leggere il parlato nella sua lingua, crea invece una normale trascrizione.",
    },
    {
      question: 'Perché una trascrizione tradotta è meno esatta di una normale?',
      answer:
        "Tradurre è un compito più difficile che scrivere le parole. Il parlato va compreso e riformulato in un solo passaggio, quindi le frasi possono essere accorciate, modi di dire e battute persi e nomi uditi male. Controlla tutto ciò che è importante con l'audio o con una trascrizione nella lingua originale.",
    },
    {
      question: 'Perché la mia traduzione è uscita nella lingua originale?',
      answer:
        'La causa probabile è la scelta della qualità. Alta precisione esegue il modello Large v3 Turbo, che non è stato addestrato a tradurre e tende a scrivere invece la lingua originale. Ricomincia con Standard o Massima precisione e controlla che Risultato sia impostato su Traduci in inglese.',
    },
    {
      question: "Posso ottenere sottotitoli in inglese per un video in un'altra lingua?",
      answer:
        'Sì. Dopo la traduzione, scarica SRT o VTT. Le righe in inglese portano la temporizzazione del parlato originale. Leggile per intero prima di pubblicare e ricorda che la traduzione è una bozza.',
    },
    {
      question: 'Perché non posso scegliere Traduci in inglese?',
      answer:
        'Non è disponibile per il motore sperimentale Qwen3 ASR. Riporta Motore di riconoscimento su Whisper in Altre opzioni e la scelta torna.',
    },
  ],

  links: [
    {
      label: 'Audio hindi in testo (pagina in inglese)',
      path: '/hindi-audio-to-text',
      note: 'Leggi il parlato hindi nella sua lingua prima di tradurlo.',
    },
    {
      label: 'Audio spagnolo in testo (pagina in inglese)',
      path: '/spanish-audio-to-text',
      note: 'Crea una trascrizione in spagnolo con gli accenti, senza tradurla.',
    },
    {
      label: 'Generatore di sottotitoli per YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Crea un SRT per il tuo video e caricalo in YouTube Studio.',
    },
    {
      label: 'Come aggiungere sottotitoli a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Cosa fare con il file SRT o VTT una volta ottenuto.',
    },
  ],
};
