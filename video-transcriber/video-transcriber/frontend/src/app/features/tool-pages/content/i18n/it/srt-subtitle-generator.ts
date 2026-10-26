import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Generatore di sottotitoli SRT',
  h1: 'Genera sottotitoli SRT da un file video o audio',
  lead: "Carica un video e scarica un file .srt pronto all'uso con ogni riga temporizzata sul parlato. Gratis, senza registrazione, e puoi correggere il testo prima di esportare.",
  dropKind: 'video',
  dropNoun: 'il tuo video',

  whyTitle: 'Cosa trovi in un file SRT',
  why: [
    'Un file SRT è testo semplice. Elenca sequenze numerate, ognuna con un orario di inizio, un orario di fine e le parole da mostrare sullo schermo. La maggior parte dei lettori video, degli editor e delle piattaforme video può caricarne uno, il che lo rende il formato di sottotitoli più sicuro da cui partire.',
    'I sottotitoli aiutano le persone sorde o con problemi di udito, chi guarda senza audio e chiunque segua meglio una seconda lingua per iscritto. Rendono inoltre il parlato del tuo video ricercabile e citabile.',
  ],

  howTitle: 'Come generare un file SRT',
  howToDescription:
    'Carica un video, scegli la lingua, controlla le righe e scarica i sottotitoli come file SRT o VTT.',
  steps: [
    {
      title: 'Carica il video',
      text: 'Trascina il tuo video nel riquadro in cima a questa pagina oppure premi Scegli un file. Funziona anche un file audio se ti serve solo testo temporizzato.',
    },
    {
      title: 'Scegli la lingua',
      text: 'Scegli la lingua parlata. I tempi per parola sono attivi per impostazione predefinita, e questo dà una temporizzazione dei sottotitoli più precisa.',
    },
    {
      title: 'Controlla le righe',
      text: 'Apri la trascrizione, riproduci da qualsiasi timestamp e correggi le parole sbagliate. Elimina le righe che non vuoi.',
    },
    {
      title: 'Scarica SRT o VTT',
      text: 'Scegli SRT per la maggior parte dei lettori e degli editor, oppure VTT per le pagine web. Entrambi includono le tue modifiche.',
    },
  ],

  formatsTitle: 'Formati di sottotitoli e file supportati',
  formatsIntro:
    "Carica qualsiasi file video o audio e scarica i sottotitoli come SRT o VTT. Ecco com'è fatto dentro un file SRT:",
  uploadTitle: 'File che puoi caricare',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'cue numerate con i tempi, la compatibilità più ampia' },
    { name: 'VTT', use: 'WebVTT per i video HTML5 e i lettori web' },
    { name: 'TXT', use: 'le stesse parole senza i tempi' },
    { name: 'Markdown', use: 'testo con timestamp' },
    { name: 'JSON', use: 'ogni riga e ogni tempo, per i programmi' },
    { name: 'PDF', use: 'un copione stampabile' },
  ],
  exampleLabel: 'Un esempio di file SRT',
  example: `1
00:00:01,000 --> 00:00:04,200
Bentornati sul canale.

2
00:00:04,500 --> 00:00:07,800
Oggi vediamo come funzionano i sottotitoli.`,

  tipsTitle: 'Consigli per sottotitoli migliori',
  tips: [
    {
      title: 'Tieni le righe corte.',
      text: 'Una regola comune è due righe di circa 42 caratteri. Le righe seguono il parlato, quindi quelle molto lunghe potrebbero dover essere divise in un editor di sottotitoli.',
    },
    {
      title: 'Guarda prima di pubblicare.',
      text: 'Riproduci il video con i sottotitoli attivi. I sottotitoli automatici richiedono un controllo umano, soprattutto per nomi, numeri e termini tecnici.',
    },
    {
      title: 'Usa un suggerimento di vocabolario.',
      text: 'Elenca nomi e termini tecnici in Altre opzioni, così vengono scritti come vuoi.',
    },
    {
      title: 'Scegli il formato giusto.',
      text: 'SRT per lettori, editor e la maggior parte dei moduli di caricamento. VTT per il tag video HTML5 e i lettori web.',
    },
    {
      title: 'Ti servono sottotitoli in inglese?',
      text: 'Imposta Risultato su Traduci in inglese in Altre opzioni. La traduzione è automatica, quindi leggila tutta prima di pubblicare.',
    },
  ],

  faqs: [
    {
      question: "Che cos'è un file SRT?",
      answer:
        'SubRip (.srt) è un formato di sottotitoli in testo semplice. Ogni cue ha un numero, un orario di inizio e di fine e il testo da mostrare. Qualsiasi editor di testo può aprirlo.',
    },
    {
      question: 'Devo scegliere SRT o VTT?',
      answer:
        "Usa SRT per lettori video, editor e la maggior parte dei moduli di caricamento. Usa VTT (WebVTT) quando aggiungi sottotitoli a una pagina web con l'elemento video HTML5. TranscribeVid esporta entrambi dalla stessa trascrizione.",
    },
    {
      question: 'Incorpora i sottotitoli nel mio video?',
      answer:
        "No. Ottieni un file di sottotitoli separato e il video non viene modificato. Per incorporare i sottotitoli nell'immagine serve un editor video.",
    },
    {
      question: 'Quanto è precisa la temporizzazione?',
      answer:
        "La temporizzazione segue il parlato ed è di solito vicina, ma non è precisa al fotogramma. Controlla la prima e l'ultima riga e, se ti serve una sincronia esatta, regola in un editor di sottotitoli.",
    },
    {
      question: "Posso creare sottotitoli in un'altra lingua?",
      answer:
        'Puoi trascrivere nella lingua parlata (più di 50 sono supportate) oppure tradurre il parlato in inglese. La traduzione in altre lingue non è offerta.',
    },
  ],
};
