import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Generatore di sottotitoli VTT',
  h1: 'Genera un file di sottotitoli WebVTT (.vtt) da un video',
  lead: "Aggiungi un file video o audio e scarica un file di sottotitoli WebVTT temporizzato sul parlato. Gratis, senza registrazione, e puoi correggere le righe prima di esportare. Usalo con l'elemento video HTML5 o con qualsiasi lettore web.",
  dropKind: 'video',
  dropNoun: 'il tuo video',

  whyTitle: "Cos'è WebVTT e perché lo usa il web",
  why: [
    "WebVTT (.vtt) è il formato di sottotitoli del web. È un file di testo semplice che i browser comprendono nativamente: punta l'elemento track di un video a un file .vtt e le didascalie compaiono, senza plugin né script.",
    "Assomiglia molto all'SRT, con alcune differenze che contano. Un file VTT inizia con la parola WEBVTT, usa un punto invece di una virgola prima dei millisecondi e non richiede cue numerate. La maggior parte dei lettori web lo legge. Se non sei sicuro di quale formato ti serva, la guida su SRT e VTT spiega la scelta.",
  ],

  sections: [
    {
      title: 'Come usare un file VTT nella tua pagina web',
      paragraphs: [
        `Salva il file .vtt accanto al video, poi aggiungi un elemento track dentro l'elemento video, per esempio: <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. Gli attributi fanno quanto segue.`,
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Usa subtitles per le parole pronunciate. Usa captions quando il file descrive anche altri suoni, come musica o risate.',
        },
        {
          title: 'srclang.',
          text: "La lingua del file come codice breve, per esempio en per l'inglese o es per lo spagnolo. Aggiungi un elemento track per ogni lingua che hai.",
        },
        {
          title: 'label e default.',
          text: 'label è il nome mostrato nel menu delle didascalie del lettore. default attiva quella traccia al caricamento della pagina.',
        },
      ],
    },
    {
      title: 'Perché le didascalie non compaiono: le cause più comuni',
      paragraphs: [
        "Tieni il file .vtt sullo stesso sito della pagina. Un file su un altro dominio richiede le giuste intestazioni cross-origin dal suo server, e l'elemento video richiede un attributo crossorigin, altrimenti il browser lo ignora senza avvisare. Controlla anche che la prima riga del file sia WEBVTT e che le didascalie siano attivate nei comandi del lettore.",
      ],
    },
    {
      title: 'Cosa fa e cosa non fa questo generatore',
      paragraphs: [
        "Trasforma il parlato del tuo video in testo temporizzato. Le righe vengono tagliate a fine frase e alle pause, in righe di circa 42 caratteri con al massimo due righe, e il file contiene solo testo temporizzato. Non traduce in altre lingue (tranne l'inglese, tramite Risultato in Altre opzioni), non aggiunge nomi dei parlanti, non crea stili né marcatori di capitolo e non incorpora i sottotitoli nell'immagine. WebVTT stesso supporta stili e capitoli, e puoi aggiungerli a mano in un editor di testo.",
      ],
    },
  ],

  howTitle: 'Come generare un file di sottotitoli VTT',
  howToDescription:
    'Aggiungi un video, scegli la lingua, controlla le righe e scarica i sottotitoli come file WebVTT.',
  steps: [
    {
      title: 'Aggiungi il tuo video',
      text: 'Metti un video nel riquadro in cima a questa pagina: trascinalo lì oppure premi Scegli un file. Funziona anche un file solo audio, se ti serve solo testo temporizzato. Nella pagina successiva, Aggiungi un altro file ne porta altri.',
    },
    {
      title: 'Scegli la lingua',
      text: 'Nella pagina successiva scegli la lingua parlata, oppure lascia attivo Rileva automaticamente. Tieni attivi i Tempi per parola in Altre opzioni: inizio e fine di ogni riga seguono allora le parole. Poi premi Trascrivi.',
    },
    {
      title: 'Controlla le righe',
      text: 'Leggi la trascrizione, riproduci da un timestamp per verificarla e correggi le parole sbagliate. Elimina le righe che non vuoi nei sottotitoli.',
    },
    {
      title: 'Scarica il VTT',
      text: "Scegli VTT dalle opzioni di download. Le tue modifiche sono incluse. L'SRT è disponibile dalla stessa trascrizione se un lettore ne ha bisogno.",
    },
  ],

  formatsTitle: 'Il formato VTT e i file supportati',
  formatsIntro:
    "Aggiungi qualsiasi file video o audio e scarica WebVTT. Ecco com'è fatto dentro un file VTT:",
  uploadTitle: 'File che puoi aggiungere',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: "WebVTT per l'elemento video HTML5 e i lettori web" },
    { name: 'SRT', use: 'cue numerate, per la maggior parte di lettori ed editor' },
    { name: 'TXT', use: 'le stesse parole senza i tempi' },
    { name: 'Markdown', use: 'testo con timestamp' },
    { name: 'JSON', use: 'ogni riga e ogni tempo, per i programmi' },
    { name: 'PDF', use: 'un copione stampabile' },
  ],
  exampleLabel: 'Un esempio di file WebVTT',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Buongiorno a tutti e benvenuti.

00:00:04.000 --> 00:00:07.300
In questo video configuriamo il progetto da zero.

00:00:07.700 --> 00:00:10.900
Cominciamo dalla struttura delle cartelle.`,

  tipsTitle: 'Consigli per i file WebVTT',
  tips: [
    {
      title: 'Provalo in un vero browser.',
      text: 'Apri la tua pagina, premi riproduci e attiva le didascalie nei comandi del video. Fallo in più di un browser prima di pubblicare.',
    },
    {
      title: 'Usa il codice lingua giusto.',
      text: 'Imposta srclang su un codice valido come en, es o hi. Un codice sbagliato può far etichettare o scegliere male la traccia dal lettore.',
    },
    {
      title: 'Leggi le righe a velocità normale.',
      text: "Riproduci il video con l'audio spento e le didascalie attive e verifica che ogni riga resti sullo schermo abbastanza a lungo da poter essere letta.",
    },
    {
      title: 'Scrivi i nomi come li vuoi.',
      text: 'Inserisci marchi e termini tecnici nel suggerimento di vocabolario in Altre opzioni prima di iniziare, così escono giusti in ogni riga.',
    },
  ],

  faqs: [
    {
      question: 'In cosa un file VTT è diverso da un file SRT?',
      answer:
        "Un file VTT inizia con la riga WEBVTT, scrive i tempi con un punto (00:00:01.000) dove l'SRT usa una virgola (00:00:01,000) e non richiede numeri di cue. I browser leggono il VTT nell'elemento video, mentre l'SRT richiede un lettore o uno script che lo supporti.",
    },
    {
      question: 'Come aggiungo un file VTT a un video HTML?',
      answer:
        "Salva il file .vtt accanto al video e aggiungi un elemento track dentro l'elemento video, con kind impostato su subtitles, src che punta al file, srclang impostato sul codice della lingua e un label per il menu.",
    },
    {
      question: 'Quali lettori leggono i file VTT?',
      answer:
        "Tutti i principali browser leggono il VTT tramite l'elemento video, e la maggior parte dei lettori video web lo legge a sua volta. Alcuni lettori desktop ed editor preferiscono l'SRT. Per quelli, scarica l'SRT dalla stessa trascrizione.",
    },
    {
      question: 'Il file VTT può includere capitoli o stili?',
      answer:
        'Il file creato da TranscribeVid contiene solo testo temporizzato. WebVTT stesso supporta stili e capitoli, che puoi aggiungere a mano in un editor di testo.',
    },
    {
      question: 'Perché il mio file VTT non compare nel lettore?',
      answer:
        'Le cause più comuni sono una prima riga diversa da WEBVTT, un file su un altro dominio senza le giuste intestazioni cross-origin, un srclang o un kind sbagliato, oppure didascalie disattivate nel lettore. Apri il file in un editor di testo e controlla la prima riga.',
    },
  ],

  links: [
    {
      label: 'Generatore di sottotitoli SRT',
      path: '/srt-subtitle-generator',
      note: 'La stessa trascrizione come file SRT numerato, con un esempio pratico.',
    },
    {
      label: 'SRT o VTT: quale formato di sottotitoli usare',
      path: '/guides/srt-vs-vtt',
      note: 'Uno sguardo affiancato ai due formati e a dove funziona ciascuno.',
    },
    {
      label: 'Come aggiungere sottotitoli a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Dalla trascrizione alle didascalie pubblicate, per il web e per altri lettori.',
    },
    {
      label: 'WebM in testo',
      path: '/webm-to-text',
      note: 'Per le registrazioni dello schermo e del browser, il formato che si adatta meglio a un file VTT.',
    },
  ],
};
