import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Video in testo',
  h1: 'Converti video in testo, gratis e con timestamp',
  lead: 'Carica un video registrato e guarda il suo parlato trasformarsi in testo, riga per riga, ognuna con il proprio orario. Lezioni, interviste, riunioni, clip girate con il telefono e registrazioni dello schermo funzionano tutte, in più di 50 lingue.',
  dropKind: 'video',
  dropNoun: 'il tuo video',

  whyTitle: 'Perché trasformare un video in testo',
  why: [
    'In un video è lento cercare. Non puoi scorrerlo con lo sguardo, citarlo o copiarne una frase. Una trascrizione trasforma il parlato in testo che puoi cercare, citare, tradurre e leggere in una frazione del tempo, e ogni riga mantiene il proprio timestamp, così puoi tornare al momento esatto.',
    'Lo usano per lezioni e webinar registrati, riprese di interviste, riunioni di team salvate, dimostrazioni di prodotto, vlog e brevi clip dei social. Il testo è anche un buon punto di partenza per sottotitoli, note di puntata, articoli di blog e verbali di riunione.',
  ],

  howTitle: 'Come convertire un video in testo',
  howToDescription:
    'Carica un file video, scegli la lingua parlata, attendi la trascrizione e scaricala come testo o sottotitoli.',
  steps: [
    {
      title: 'Scegli il tuo video',
      text: 'Trascina il video nel riquadro in cima a questa pagina oppure premi Scegli un file. Si apre nel caricatore, dove puoi aggiungere altri video.',
    },
    {
      title: 'Imposta lingua e qualità',
      text: 'Scegli la lingua parlata per ottenere la massima precisione, oppure lascia attivo il riconoscimento automatico. Standard va bene per la maggior parte dei video. Più veloce è rapido con un parlato chiaro. Per audio rumoroso o difficile scegli Alta precisione o Massima precisione; Massima precisione richiede più tempo e commette meno errori.',
    },
    {
      title: 'Guarda la trascrizione',
      text: 'Il testo compare in diretta, riga per riga, con una barra di avanzamento e una stima del tempo rimanente.',
    },
    {
      title: 'Modifica e scarica',
      text: "Correggi qualsiasi riga nell'editor, poi scarica TXT, SRT, VTT, Markdown, JSON o PDF. Al termine della sessione non viene conservato nulla, quindi scarica prima di andare via.",
    },
  ],

  formatsTitle: 'File video supportati e download',
  formatsIntro:
    "TranscribeVid legge la traccia audio, quindi l'immagine può avere qualsiasi qualità. Funzionano anche i file solo audio.",
  uploadTitle: 'File video che puoi caricare',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'testo semplice da leggere o incollare' },
    { name: 'SRT', use: 'sottotitoli per lettori e editor' },
    { name: 'VTT', use: 'sottotitoli per i video sul web' },
    { name: 'Markdown', use: 'testo con titoli e tempi' },
    { name: 'JSON', use: 'righe temporizzate per i programmi' },
    { name: 'PDF', use: 'una copia stampabile' },
  ],

  tipsTitle: 'Consigli per trascrizioni video migliori',
  tips: [
    {
      title: 'Ascolta prima il primo minuto.',
      text: 'Se fai fatica a seguire il parlato dagli altoparlanti del portatile, ci riuscirà con difficoltà anche il software. Risolvi i problemi di volume prima di caricare.',
    },
    {
      title: 'Indica la lingua.',
      text: 'Scegliere la lingua parlata è più affidabile del riconoscimento automatico, soprattutto per clip brevi o con accento.',
    },
    {
      title: 'Aggiungi un suggerimento di vocabolario.',
      text: 'In Altre opzioni elenca nomi, marchi e termini tecnici scritti come vuoi vederli.',
    },
    {
      title: 'Resta entro il limite.',
      text: 'I video più lunghi o più grandi del limite indicato sopra vengono rifiutati, quindi dividi prima le registrazioni lunghe in parti.',
      browser: {
        title: 'I video lunghi richiedono più tempo.',
        text: "Non c'è un limite di dimensione, ma un video lungo richiede più tempo sul tuo dispositivo e più memoria. Su un telefono, dividi in parti le registrazioni molto lunghe.",
      },
    },
    {
      title: 'Controlla le righe segnalate.',
      text: 'Le righe di cui il riconoscitore non è sicuro sono segnalate. Rivedi prima quelle, perché nessuna trascrizione è perfetta.',
    },
  ],

  faqs: [
    {
      question: 'Convertire un video in testo è davvero gratis?',
      answer:
        "Sì. È gratis, non serve un account né un accesso e non c'è una quota giornaliera o mensile. {limits} Se molte persone usano il servizio, il tuo file potrebbe restare un po' in coda.",
      browser: {
        answer:
          "Sì. È gratis, non serve un account né un accesso e non c'è una quota giornaliera o mensile; la pubblicità lo mantiene gratuito. Il tuo video viene trascritto nel browser, sul tuo dispositivo, quindi non c'è un limite di dimensione e nessun altro è davanti a te: la velocità dipende dal tuo dispositivo.",
      },
    },
    {
      question: 'Posso trascrivere un video senza parlato?',
      answer:
        'Solo il parlato diventa testo. Un video muto, o con sola musica, dà un risultato vuoto o molto breve. Il testo mostrato sullo schermo non viene letto.',
    },
    {
      question: 'Posso incollare un link di YouTube?',
      answer:
        'No. TranscribeVid lavora con file che carichi o registri, non con link web. Se il video è tuo, carica il file originale.',
    },
    {
      question: 'Dice chi sta parlando?',
      answer:
        'No. Non vengono aggiunti nomi o etichette dei parlanti. Ogni riga ha un timestamp e puoi scrivere i nomi nel testo mentre modifichi.',
    },
    {
      question: 'Quanto è accurata la conversione da video a testo?',
      answer:
        'Con un parlato chiaro in una lingua supportata di solito è molto accurata, ma nessun riconoscimento vocale è perfetto. Rumore, accenti, musica e voci sovrapposte riducono la precisione, quindi controlla i passaggi importanti confrontandoli con il video.',
    },
  ],
};
