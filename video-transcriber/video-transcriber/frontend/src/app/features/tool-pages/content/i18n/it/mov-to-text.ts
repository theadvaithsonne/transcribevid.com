import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV in testo',
  h1: 'Trascrivi un video MOV in testo',
  lead: "MOV è ciò che registrano iPhone, Mac e molte fotocamere. Aggiungi il tuo MOV e ottieni una trascrizione con timestamp, gratis, senza registrazione. Si legge solo l'audio, quindi dimensioni e codec dell'immagine non contano.",
  dropKind: 'video',
  dropNoun: 'il tuo file MOV',

  whyTitle: 'Perché i file MOV non richiedono conversione',
  why: [
    "MOV è il formato QuickTime di Apple. Come un MP4, tiene insieme immagine e audio, e la maggior parte dei file MOV contiene audio AAC che viene letto direttamente. TranscribeVid legge quell'audio e ignora l'immagine, quindi non serve un passaggio separato da MOV a MP4.",
    "I file MOV sono spesso grandi, perché telefoni e fotocamere registrano ad alta qualità. Non devi ridurre né convertire il tuo. La via più rapida dal rullino a una trascrizione è aggiungere il file così com'è.",
  ],

  sections: [
    {
      title: 'Da dove arrivano i file MOV',
      bullets: [
        {
          title: 'Video di iPhone e iPad.',
          text: "I video registrati con l'app Fotocamera vengono salvati come file .MOV, sia che il formato dell'immagine sia H.264 o HEVC.",
        },
        {
          title: 'Registrazioni dello schermo del Mac.',
          text: 'La barra degli strumenti degli screenshot (Maiusc-Comando-5) e QuickTime Player salvano le registrazioni dello schermo come .mov. Scegli un microfono prima di registrare, altrimenti il file non contiene parlato.',
        },
        {
          title: 'Fotocamere e software di montaggio.',
          text: 'Molte fotocamere mirrorless registrano in MOV, e gli editor video come Final Cut Pro e Adobe Premiere Pro possono esportarlo.',
        },
      ],
    },
    {
      title: 'Come ottenere un video dal tuo iPhone',
      paragraphs: [
        "Il modo più semplice è aprire questa pagina sull'iPhone stesso e premere Scegli un file. Puoi scegliere un video dalla libreria Foto o da File. Se il telefono ti chiede quale formato usare quando lo scegli, va bene entrambe le risposte, perché si legge solo l'audio.",
        'Per trascrivere invece su un computer, invia il video con AirDrop, salvalo in File o in iCloud Drive, oppure copialo con un cavo. I nomi dei menu cambiano tra le versioni di iOS e macOS, quindi considerali una guida.',
      ],
    },
    {
      title: 'Video con più di una traccia audio',
      paragraphs: [
        "Alcune fotocamere ed editor scrivono più tracce audio in un unico MOV, per esempio un microfono della fotocamera e un microfono a clip. TranscribeVid usa la prima traccia audio che riesce a leggere. Se il parlato che ti serve è su un'altra traccia, esporta prima una copia con quella traccia, oppure unisci le tracce nel tuo editor.",
      ],
    },
  ],

  howTitle: 'Come convertire un MOV in testo',
  howToDescription:
    'Aggiungi il video MOV, scegli la lingua parlata e la qualità, attendi la trascrizione e scaricala.',
  steps: [
    {
      title: 'Aggiungi il MOV',
      text: 'Premi Scegli un file in cima a questa pagina, oppure trascina il .mov sul riquadro. Un iPhone offre Foto e File. In questo riquadro entra un video alla volta; Aggiungi un altro file, nella pagina successiva, ne mette in coda altri.',
    },
    {
      title: 'Imposta lingua e qualità',
      text: 'Nella pagina successiva scegli la lingua parlata. Si consiglia Standard. Con vento, traffico o un parlante lontano, Alta precisione e Massima precisione richiedono più tempo e commettono meno errori. Poi premi Trascrivi.',
      browser: {
        text: 'Nella pagina successiva scegli la lingua parlata. Si consiglia Standard. Con vento, traffico o un parlante lontano, prova Alta precisione o Massima precisione se il tuo dispositivo le offre: richiedono più tempo e commettono meno errori, ciascuna è un download iniziale più grande e un dispositivo che non può eseguirne una la mostra disattivata con il motivo. Poi premi Trascrivi.',
      },
    },
    {
      title: 'Leggi e correggi',
      text: 'Il testo arriva riga per riga con un orario su ciascuna. Riproduci da qualsiasi riga, correggi ciò che è sbagliato ed elimina le righe che non vuoi.',
    },
    {
      title: 'Scarica la trascrizione',
      text: 'Ottieni TXT o un PDF da leggere, oppure SRT o VTT da usare come didascalie in un editor video o sul web. Il tuo MOV non viene mai modificato.',
    },
  ],

  formatsTitle: 'MOV e altri formati video',
  formatsIntro:
    'Lo stesso riquadro accetta MOV e questi altri tipi, e anche i normali formati audio.',
  uploadTitle: 'File video che puoi aggiungere',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'le parole pronunciate come testo semplice' },
    { name: 'SRT', use: 'didascalie per editor e lettori' },
    { name: 'VTT', use: 'didascalie per una pagina web' },
    { name: 'PDF', use: 'una trascrizione da stampare o condividere' },
    { name: 'Markdown', use: 'appunti con i tempi' },
    { name: 'JSON', use: 'dati per i tuoi strumenti' },
  ],

  tipsTitle: 'Consigli per trascrivere video MOV',
  tips: [
    {
      title: "Tieni attivo Migliora l'audio.",
      text: "I video del telefono catturano vento, rumori di manipolazione ed eco della stanza. L'opzione Migliora l'audio in Altre opzioni toglie rimbombi bassi e fruscii e fa emergere le voci basse.",
    },
    {
      title: 'Controlla quale traccia ha la voce.',
      text: 'Se una fotocamera ha registrato due microfoni come tracce separate, riproduci il video e verifica che la prima traccia sia quella con il parlato.',
    },
    {
      title: 'Taglia le registrazioni lunghe in punti naturali.',
      text: "I file oltre il limite di dimensione o durata vengono rifiutati. Dividi il video in parti, oppure esporta solo l'audio, poi aggiungilo.",
      browser: {
        title: 'Le registrazioni lunghe richiedono memoria.',
        text: "Il sito non impone alcun limite di dimensione o durata, ma un video lungo richiede tempo e memoria libera, soprattutto su un telefono, e un browser più vecchio può rifiutare un file molto lungo. Per una registrazione molto lunga, esporta solo l'audio dal tuo editor oppure dividi il video in parti.",
      },
    },
    {
      title: "Registra con l'audio di proposito.",
      text: 'Una registrazione dello schermo del Mac fatta senza microfono non ha parlato, e la trascrizione risulta vuota.',
    },
  ],

  faqs: [
    {
      question: "Posso trascrivere un video dell'iPhone senza convertire il MOV in MP4?",
      answer:
        "Sì. Aggiungi il MOV così com'è. TranscribeVid legge la traccia audio e ignora l'immagine, quindi non serve alcuna conversione.",
    },
    {
      question: "Funziona un video 4K o HEVC dell'iPhone?",
      answer:
        "Sì. Si usa solo l'audio, quindi dimensioni dell'immagine e formato video non contano. Conta la traccia audio, e le registrazioni di iPhone e Mac usano audio AAC, che viene letto direttamente.",
    },
    {
      question: "Come porto un video dall'iPhone a un computer per trascriverlo?",
      answer:
        "Invialo con AirDrop a un Mac, salvalo in File o in iCloud Drive, oppure copialo con un cavo. Oppure salta il computer: apri questa pagina sull'iPhone e scegli il video da Foto.",
    },
    {
      question: 'Perché la registrazione dello schermo del mio Mac non ha testo?',
      answer:
        'Una registrazione dello schermo porta audio solo se è stato scelto un microfono prima di registrare. Nella barra degli strumenti Maiusc-Comando-5, apri Opzioni, scegli un microfono e registra di nuovo. I nomi dei menu possono variare tra le versioni di macOS.',
    },
    {
      question: 'Cosa succede se il mio MOV ha due tracce audio?',
      answer:
        "TranscribeVid usa la prima traccia audio che riesce a leggere. Se il parlato è su un'altra traccia, esporta prima una copia con quella traccia, oppure unisci le tracce nel tuo editor.",
    },
  ],

  links: [
    {
      label: 'MP4 in testo',
      path: '/mp4-to-text',
      note: "Lo stesso servizio per i file MP4, l'altro formato comune dei video del telefono.",
    },
    {
      label: 'Video in testo',
      path: '/video-to-text',
      note: 'La pagina principale per qualsiasi file video, con consigli per lezioni, interviste e clip.',
    },
    {
      label: 'Generatore di sottotitoli SRT',
      path: '/srt-subtitle-generator',
      note: "Crea le didascalie per il tuo MOV e guarda com'è fatto dentro un file SRT.",
    },
    {
      label: 'Come aggiungere sottotitoli a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Cosa fare con il file di sottotitoli una volta scaricato.',
    },
  ],
};
