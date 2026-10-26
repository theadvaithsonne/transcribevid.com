import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A in testo',
  h1: 'Trascrivi una nota vocale M4A in testo',
  lead: 'M4A è ciò che salvano le Memo Vocali di iPhone e Mac, molti registratori Android e le app Apple. Aggiungi il file e ottieni una trascrizione con timestamp, gratis, senza registrazione e senza conversione in MP3.',
  dropKind: 'audio',
  dropNoun: 'il tuo file M4A',

  whyTitle: 'Perché i file M4A si trascrivono bene',
  why: [
    "Un M4A è un file MPEG-4 solo audio. Di solito contiene audio AAC, che è compresso ma più che sufficiente per il parlato, quindi i file M4A sono piccoli e si trascrivono bene. TranscribeVid li legge direttamente. Non c'è nulla da convertire prima.",
    'Le note vocali si fanno in movimento, quindi sono spesso a basso volume, con eco o registrate con il telefono in tasca. Le scelte di qualità e le opzioni di pulizia di questa pagina esistono proprio per questo tipo di registrazione.',
  ],

  sections: [
    {
      title: 'Come recuperare una nota vocale dal telefono',
      paragraphs: [
        'I nomi dei menu cambiano tra le versioni di iOS, macOS e Android, quindi considerali una guida. Se sei sul telefono stesso, premi Scegli un file e seleziona la registrazione da File o dalla cartella delle registrazioni. Non serve un computer.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'In Memo Vocali, apri la registrazione, tocca il pulsante Altro (tre puntini) e scegli Condividi. Salvala in File, oppure inviala a te stesso con AirDrop o via e-mail, poi aggiungila qui.',
        },
        {
          title: 'Mac.',
          text: 'Trascina una registrazione dalla finestra di Memo Vocali sulla Scrivania. Arriva come file .m4a, pronto da aggiungere.',
        },
        {
          title: 'Android.',
          text: "Molte app di registrazione salvano file M4A in una cartella Registrazioni o Registratore vocale. Il nome della cartella dipende dall'app, e il selettore di file può aprirla.",
        },
      ],
    },
    {
      title: 'Note vocali senza perdita e compresse',
      paragraphs: [
        'Le Memo Vocali di iPhone possono salvare le registrazioni come Compresse o Senza perdita. I file senza perdita sono molto più grandi, finiscono comunque in .m4a e di solito usano il codec Apple Lossless. Il parlato non ne ha bisogno: una nota Compressa dà la stessa trascrizione con una frazione dello spazio.',
      ],
      browser: {
        paragraphs: [
          'Le Memo Vocali di iPhone possono salvare le registrazioni come Compresse o Senza perdita. I file senza perdita sono molto più grandi, finiscono comunque in .m4a e di solito usano il codec Apple Lossless, che non tutti i browser sanno leggere da soli. Se il tuo non ci riesce, la pagina può proporti di caricare un piccolo convertitore (circa 9 MB) che gira sul tuo dispositivo. Il parlato non ha bisogno del Senza perdita: una nota Compressa dà la stessa trascrizione con una frazione dello spazio.',
        ],
      },
    },
  ],

  howTitle: 'Come trasformare un M4A in testo',
  howToDescription:
    'Aggiungi il file M4A, scegli la lingua parlata, attendi la trascrizione e scaricala come testo.',
  steps: [
    {
      title: "Aggiungi l'M4A",
      text: 'Trascina la nota .m4a sul riquadro in cima a questa pagina, oppure premi Scegli un file e, su un telefono, selezionala da File o dalla cartella delle registrazioni. In questo riquadro entra una sola nota; una volta nella pagina successiva, Aggiungi un altro file porta dentro le altre.',
    },
    {
      title: 'Scegli la lingua',
      text: 'Nella pagina successiva seleziona la lingua parlata. Una nota breve dà poco materiale a Rileva automaticamente, quindi indicare la lingua è più affidabile. La qualità Standard va bene per la maggior parte delle note. Poi premi Trascrivi.',
    },
    {
      title: 'Attendi la trascrizione',
      text: 'Le righe compaiono una a una con una barra di avanzamento e una stima del tempo rimanente. Riproduci da qualsiasi riga per sentire cosa è stato detto.',
    },
    {
      title: 'Correggi e salva',
      text: 'Correggi qualsiasi parola sbagliata, poi scarica TXT, Markdown o PDF per gli appunti, oppure SRT o VTT se la nota accompagna un video. Una trascrizione esiste solo per la tua sessione, quindi scaricala prima di chiudere la pagina.',
    },
  ],

  formatsTitle: 'M4A e altri formati audio',
  formatsIntro:
    'I registratori di telefoni e computer salvano in formati diversi. Questo riquadro li accetta tutti.',
  uploadTitle: 'File audio che puoi aggiungere',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'le tue parole come testo semplice' },
    { name: 'Markdown', use: 'appunti con i tempi' },
    { name: 'PDF', use: 'una copia stampabile della nota' },
    { name: 'SRT', use: 'righe temporizzate per un video che accompagna la nota' },
    { name: 'VTT', use: 'righe temporizzate per i lettori web' },
    { name: 'JSON', use: 'righe strutturate per i programmi' },
  ],

  tipsTitle: 'Consigli per trascrivere le note vocali',
  tips: [
    {
      title: 'Tieni il telefono vicino.',
      text: "Una nota registrata con il telefono in tasca o dall'altra parte di un tavolo è difficile per qualsiasi riconoscitore. Tieni il telefono a una spanna dalla bocca e parla di lato, non dentro.",
    },
    {
      title: 'Taglia prima di condividere.',
      text: "La maggior parte delle app di note vocali permette di tagliare l'inizio e la fine di una registrazione. Eliminare una lunga pausa a un'estremità fa risparmiare tempo di attesa.",
    },
    {
      title: 'Indica la lingua.',
      text: 'Per una nota di dieci o venti secondi, scegliere la lingua parlata batte il riconoscimento automatico, soprattutto con parlato con accento o un mix di lingue.',
    },
    {
      title: 'Dagli i nomi difficili.',
      text: 'Aggiungi i nomi insoliti al suggerimento di vocabolario in Altre opzioni e sarà molto più probabile che vengano scritti bene.',
    },
  ],

  faqs: [
    {
      question: 'Posso trascrivere una Memo Vocale di iPhone senza convertirla?',
      answer:
        "Sì. Le Memo Vocali sono file M4A e TranscribeVid legge direttamente l'M4A. Condividi la nota in File o sul computer, poi aggiungila qui. Non convertirla prima in MP3.",
    },
    {
      question: 'Un file M4A è lo stesso di un MP4?',
      answer:
        "Sono parenti stretti. Entrambi usano il contenitore MPEG-4; un M4A contiene solo audio, mentre un MP4 di solito porta anche il video. TranscribeVid legge l'audio da entrambi.",
    },
    {
      question: 'Perché la trascrizione del mio M4A è vuota o molto breve?',
      answer:
        "La nota potrebbe essere muta, molto bassa o fatta soprattutto di rumore di fondo. Riascoltala prima. Se è debole, tieni attivo Migliora l'audio in Altre opzioni e controlla che il file non sia stato troncato quando l'hai condiviso.",
    },
    {
      question: 'Posso trascrivere una lunga riunione registrata sul telefono?',
      answer:
        "Sì. I file M4A sono piccoli, quindi è facile aggiungere una registrazione lunga. {limits} Non c'è una quota giornaliera o mensile.",
      browser: {
        answer:
          'Sì. I file M4A sono piccoli, quindi è facile aggiungere una registrazione lunga. Il sito non impone alcun limite di dimensione o durata perché il lavoro lo fa il tuo dispositivo, quindi una nota molto lunga richiede semplicemente più tempo, e su un dispositivo più lento la pagina lo dice prima che tu inizi. Un browser più vecchio può rifiutare un file molto lungo.',
      },
    },
    {
      question: 'Posso trascrivere una nota vocale in hindi o in spagnolo?',
      answer:
        "Sì. Scegli la lingua parlata dall'elenco di più di 50, oppure lascia attivo Rileva automaticamente per una nota in una sola lingua. Per l'hindi, Stile della trascrizione (accanto a Lingua) ti permette di scegliere i caratteri latini (Hinglish) o la scrittura devanagari originale.",
    },
  ],

  links: [
    {
      label: 'Registrazione vocale in testo',
      path: '/voice-recording-to-text',
      note: 'Registra con il microfono nella pagina invece di caricare un file.',
    },
    {
      label: 'MP3 in testo',
      path: '/mp3-to-text',
      note: "La stessa trascrizione gratuita per i file MP3, l'altro formato vocale comune.",
    },
    {
      label: 'Lezione in testo',
      path: '/lecture-to-text',
      note: 'Trasforma una lezione registrata in appunti che puoi cercare e studiare.',
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Semplici modifiche alla registrazione e alle impostazioni che fanno la differenza maggiore.',
    },
  ],
};
