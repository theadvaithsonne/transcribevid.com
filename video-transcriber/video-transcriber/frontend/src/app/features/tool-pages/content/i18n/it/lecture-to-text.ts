import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Lezione in testo',
  h1: 'Lezione in testo: trasforma una registrazione in una trascrizione ricercabile',
  lead: "Registra la lezione, trascina qui il file e leggila come testo con timestamp: qualcosa che puoi cercare per un argomento d'esame, copiare nei tuoi appunti e confrontare con la registrazione. Senza account, senza costi e in più di 50 lingue.",
  dropKind: 'video',
  dropNoun: 'la tua registrazione della lezione',

  whyTitle: 'Perché trascrivere una lezione',
  why: [
    "Una lezione è facile da seguire e difficile da ripassare. Non puoi cercare in una registrazione la definizione che ti serve, e riascoltare un'ora per trovarla richiede quanto la lezione. Una trascrizione ti dà le parole in ordine, con l'orario accanto a ogni riga, così puoi saltare alla parte che ti serve.",
    'Aiuta anche chi trova più facile leggere che ascoltare, chi studia in una seconda lingua, chi ha perso una lezione o chi vuole il testo di un intervento che ha tenuto lui stesso. Chiedi al docente prima di registrare e segui le regole della tua istituzione sulle registrazioni.',
  ],

  sections: [
    {
      title: 'Dalla trascrizione agli appunti di studio',
      paragraphs: [
        'Una trascrizione è materia prima, non appunti finiti. Ecco quattro modi in cui la usano gli studenti.',
      ],
      bullets: [
        {
          title: 'Cerca prima di ripassare.',
          text: "Quando la trascrizione è finita, digita un termine nella casella Cerca nel testo sopra di essa. La casella conta le righe corrispondenti e le frecce passano dall'una all'altra, così puoi riprodurre ciascuna dal suo timestamp e riascoltare la spiegazione. Se una parola tecnica è stata scritta male ovunque, Sostituisci… corregge tutte le righe in una volta.",
        },
        {
          title: 'Costruisci il tuo schema.',
          text: "Leggi il testo una volta, aggiungi i tuoi titoli e riducilo a ciò che ti serve. Mettere un'idea con parole tue di solito è un modo migliore per impararla che copiarla.",
        },
        {
          title: 'Controlla nomi, numeri e formule.',
          text: 'Il riconoscimento vocale scrive ciò che sente. Equazioni, simboli e termini insoliti spesso vanno corretti, quindi verificali con le slide e con la registrazione.',
        },
        {
          title: 'Elenca ciò che non hai seguito.',
          text: 'Copia in un elenco i timestamp delle parti in cui ti sei perso e portalo al prossimo tutorato o ricevimento.',
        },
      ],
    },
    {
      title: 'Vocabolario tecnico e altre lingue',
      paragraphs: [
        'Le parole di una materia sono le più difficili per qualsiasi riconoscitore vocale. Prima di iniziare, apri Altre opzioni ed elenca nel suggerimento di vocabolario i termini, i nomi di teorie e autori e le eventuali abbreviazioni. La trascrizione li scrive allora più spesso come li hai scritti tu.',
        "Se studi in una lingua che non è la tua prima, una trascrizione ti dà testo da leggere con i tuoi tempi e in cui cercare le parole. Scegli la lingua della lezione, oppure lascia Rileva automaticamente. Una lezione in un'altra lingua può anche diventare testo inglese: in Altre opzioni, imposta Risultato su Traduci in inglese. La traduzione è meno affidabile della trascrizione nella lingua originale e può perdere termini tecnici, quindi controllala con la registrazione.",
      ],
    },
  ],

  howTitle: 'Come convertire una lezione in testo',
  howToDescription:
    'Aggiungi la registrazione della lezione, imposta la lingua e i termini tecnici, attendi la trascrizione e scaricala come appunti.',
  steps: [
    {
      title: 'Aggiungi la registrazione della lezione',
      text: "Trascina il file sul riquadro qui sopra, oppure premi Scegli un file. Funzionano un file da un registratore vocale del telefono, un video di lezione salvato o una registrazione dello schermo di una lezione online, e si usa solo l'audio. Il riquadro accetta un file alla volta e lo sposta nel caricatore nella pagina successiva, dove Aggiungi un altro file porta dentro le altre sessioni di un corso.",
    },
    {
      title: 'Imposta lingua e qualità',
      text: "Nella pagina successiva scegli la lingua della lezione. Standard va bene per una registrazione chiara. Per un'aula con eco o un docente che parla veloce, Alta precisione aiuta se il tuo dispositivo riesce a eseguirla (la scelta è disattivata, con un motivo, quando non può). Aspettati un lavoro più lento e un download iniziale più grande.",
    },
    {
      title: 'Aggiungi i termini tecnici, poi inizia',
      text: 'In Altre opzioni, scrivi nel suggerimento di vocabolario i termini chiave, i nomi e le abbreviazioni, per esempio ciclo di Krebs, bayesiano, prof. Okafor. Poi premi Trascrivi.',
    },
    {
      title: 'Leggi, correggi e scarica',
      text: 'Riproduci le righe dai loro timestamp per verificarle e correggi gli errori. Poi scarica TXT o Markdown per la tua app di note, oppure PDF da stampare.',
    },
  ],

  formatsTitle: 'File di registrazione delle lezioni e download',
  formatsIntro:
    'Si possono aggiungere registrazioni del telefono, video salvati e registrazioni dello schermo delle lezioni; si legge solo la traccia audio.',
  uploadTitle: 'File di registrazione che puoi aggiungere',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: "testo semplice per un'app di note" },
    { name: 'Markdown', use: 'testo con i tempi, facile da riorganizzare' },
    { name: 'PDF', use: 'una copia di studio stampabile' },
    { name: 'SRT', use: 'didascalie, se la lezione è un video che condividi' },
  ],

  tipsTitle: 'Consigli per le registrazioni delle lezioni',
  tips: [
    {
      title: 'Chiedi prima il permesso.',
      text: 'Alcuni docenti e alcune istituzioni non consentono le registrazioni. Chiedi e segui le regole che ti vengono date.',
    },
    {
      title: 'Registra vicino a chi parla.',
      text: "Un registratore davanti all'aula di solito batte uno migliore in fondo, perché distanza ed eco spesso costano più precisione di quanta qualsiasi impostazione possa recuperare.",
    },
    {
      title: 'Dividi le sessioni molto lunghe.',
      text: 'Se una sessione è più grande o più lunga dei limiti indicati in questa pagina, dividila in parti alla pausa prima di aggiungerla.',
      browser: {
        title: 'Le sessioni lunghe richiedono più tempo.',
        text: "Non è fissato alcun limite di durata, ma una lezione lunga tiene occupato il tuo dispositivo per un po' e richiede memoria libera, e un browser che non può usare WebCodecs può faticare con un file molto lungo. Dividerla alla pausa ti dà la prima metà da leggere prima.",
      },
    },
    {
      title: 'Tieni aperte le slide mentre ripassi.',
      text: 'I titoli delle slide ti danno uno schema già pronto da confrontare con i timestamp.',
    },
    {
      title: 'Scarica prima di andare via.',
      text: 'Le trascrizioni esistono solo per la tua sessione. Salva TXT o Markdown prima di chiudere la pagina.',
    },
  ],

  faqs: [
    {
      question: 'È consentito registrare una lezione e trascriverla?',
      answer:
        'Dipende dal tuo docente e dalla tua istituzione, quindi chiedi prima di registrare e segui le loro regole. Usa una trascrizione per il tuo studio, a meno che tu abbia il permesso di condividerla. Questa non è consulenza legale.',
    },
    {
      question: 'Posso trasformare automaticamente la trascrizione di una lezione in appunti?',
      answer:
        'No. TranscribeVid ti dà le parole, con un timestamp su ogni riga, ma non riassume né aggiunge titoli. Gli appunti li costruisci tu dal testo, che è anche un buon modo per imparare il materiale.',
    },
    {
      question: 'Funziona per lezioni con equazioni o termini tecnici?',
      answer:
        'Scrive le parole che sente, quindi i termini pronunciati di solito escono bene quando li aggiungi al suggerimento di vocabolario. Simboli ed equazioni non vengono scritti come formule, quindi controllali con le tue slide.',
    },
    {
      question: 'Quanto può durare una lezione da trascrivere?',
      answer: '{limits} Una lezione più lunga va prima divisa in parti.',
      browser: {
        answer:
          "Non c'è alcun tetto alla durata della lezione. Poiché il lavoro lo fa il tuo dispositivo, una lezione lunga costa soprattutto pazienza e memoria libera, e la pagina ti avvisa quando il tuo dispositivo sembra troppo lento per farla.",
      },
    },
    {
      question: 'Posso trascrivere una lezione online che ho registrato dallo schermo?',
      answer:
        "Sì. Funziona una registrazione dello schermo salvata come MP4, MOV o WebM. Si legge solo l'audio, quindi il testo delle slide non è incluso. Aggiungi i termini delle slide al suggerimento di vocabolario.",
    },
  ],

  links: [
    {
      label: 'Video in testo',
      path: '/video-to-text',
      note: 'La pagina generale per qualsiasi video registrato, con tutti i tipi di file.',
    },
    {
      label: 'MP3 in testo',
      path: '/mp3-to-text',
      note: 'Per le registrazioni di lezioni salvate come MP3 su un telefono o un registratore.',
    },
    {
      label: 'Traduci il parlato in testo inglese',
      path: '/translate-audio-to-english',
      note: "Testo inglese da una lezione in un'altra lingua.",
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Le scelte di audio, lingua e qualità che riducono gli errori in una registrazione difficile.',
    },
  ],
};
