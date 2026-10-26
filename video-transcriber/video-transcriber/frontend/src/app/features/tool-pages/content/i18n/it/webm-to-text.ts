import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM in testo',
  h1: 'Trascrivi una registrazione WebM in testo',
  lead: 'WebM è il formato che salvano browser e registratori dello schermo. Aggiungi il tuo video o audio WebM e ottieni una trascrizione con timestamp, gratis, senza registrazione e senza conversione preliminare.',
  dropKind: 'video',
  dropNoun: 'il tuo file WebM',

  whyTitle: "Cosa c'è dentro un file WebM",
  why: [
    "WebM è un contenitore adatto al web. Di solito contiene video VP8, VP9 o AV1 con audio Opus o Vorbis. TranscribeVid legge solo l'audio, quindi non importa quale codec video ci sia dentro, e un WebM che contiene solo audio funziona altrettanto bene.",
    'Opus, il formato audio che usa la maggior parte dei file WebM, è stato progettato per la voce, il che rende queste registrazioni una buona fonte per una trascrizione. Il risultato è testo con un orario su ogni riga, pronto da cercare, citare o trasformare in sottotitoli.',
  ],

  sections: [
    {
      title: 'Da dove arrivano i file WebM',
      paragraphs: [
        'La maggior parte dei file WebM è creata dal browser stesso, ed è per questo che compaiono ogni volta che qualcuno registra qualcosa online.',
      ],
      bullets: [
        {
          title: 'Registratori dello schermo e del browser.',
          text: 'Molte estensioni per registrare lo schermo e molti registratori web salvano in WebM, perché è il formato che un browser può registrare direttamente.',
        },
        {
          title: 'Registratori vocali online.',
          text: 'Un sito che registra il tuo microfono spesso ti dà un file audio .webm. Può sembrare un file video, ma contiene solo audio.',
        },
        {
          title: 'App web che sviluppi o testi.',
          text: 'Le pagine che registrano con la funzione MediaRecorder del browser di solito producono WebM in Chrome. Firefox fa lo stesso per il video, ma le sue registrazioni solo audio sono spesso Ogg, che questa pagina legge a sua volta.',
        },
      ],
    },
    {
      title: 'Una stranezza dei file WebM registrati',
      paragraphs: [
        "Un WebM registrato dal vivo nel browser spesso non ha la durata totale scritta nel file. Alcuni lettori allora mostrano una durata sconosciuta o non permettono di saltare avanti, e può sembrare un file danneggiato. L'audio in sé è intatto e la trascrizione viene creata normalmente.",
        "Se una registrazione fallisce davvero, la causa di solito è più semplice: il microfono era spento, quindi non c'è alcun parlato. Riproduci il file con il volume alto prima di cercare un altro motivo.",
      ],
    },
  ],

  howTitle: 'Come convertire un WebM in testo',
  howToDescription:
    'Aggiungi il file WebM, scegli la lingua parlata, controlla le righe e scarica la trascrizione come testo o come sottotitoli WebVTT.',
  steps: [
    {
      title: 'Aggiungi il WebM',
      text: 'Trascina il file .webm sul riquadro in cima a questa pagina oppure premi Scegli un file. Un WebM che contiene solo audio entra allo stesso modo. Per più registrazioni, aggiungi la prima qui e le altre con Aggiungi un altro file nella pagina successiva.',
    },
    {
      title: 'Scegli la lingua',
      text: 'Nella pagina successiva scegli la lingua parlata, oppure lascia Rileva automaticamente per una registrazione in una sola lingua. La qualità Standard va bene per un parlato chiaro registrato con un buon microfono. Poi premi Trascrivi.',
    },
    {
      title: 'Controlla le righe',
      text: 'Guarda il testo arrivare riga per riga. Apri la trascrizione, riproduci da qualsiasi timestamp e correggi le parole sbagliate.',
    },
    {
      title: 'Scarica il risultato',
      text: 'Ottieni un TXT da leggere o cercare. Un WebM appartiene al web, quindi VTT è il file di sottotitoli naturale per lui. Ci sono anche SRT e PDF.',
    },
  ],

  formatsTitle: 'WebM e altri formati video',
  formatsIntro: 'WebM è uno dei tanti tipi di video e audio che questo riquadro accetta.',
  uploadTitle: 'File che puoi aggiungere',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'le parole pronunciate come testo semplice' },
    { name: 'VTT', use: 'sottotitoli per lo stesso WebM in una pagina web' },
    { name: 'SRT', use: 'sottotitoli per lettori e editor' },
    { name: 'Markdown', use: 'appunti con i tempi' },
    { name: 'JSON', use: 'ogni riga e ogni tempo, per i programmi' },
    { name: 'PDF', use: 'una trascrizione da stampare o condividere' },
  ],

  tipsTitle: 'Consigli per trascrivere registrazioni WebM',
  tips: [
    {
      title: 'Accendi il microfono prima di registrare.',
      text: "I registratori dello schermo spesso catturano solo l'immagine, a meno che tu non spunti l'opzione del microfono o dell'audio di sistema. Senza audio non c'è nulla da trascrivere.",
    },
    {
      title: 'Aspettati una sola traccia vocale.',
      text: 'Se hai registrato la scheda di una riunione insieme al tuo microfono, tutti finiscono nella stessa traccia. Non ci sono etichette dei parlanti, quindi aggiungi i nomi mentre modifichi.',
    },
    {
      title: 'Usa VTT per il web.',
      text: "L'elemento video di un browser legge i sottotitoli VTT tramite l'elemento track. Non legge l'SRT, quindi scegli VTT per un WebM sulla tua pagina.",
    },
    {
      title: 'Taglia le registrazioni molto lunghe.',
      text: 'I file oltre il limite di dimensione o durata vengono rifiutati, quindi taglia prima un WebM lungo in parti.',
      browser: {
        title: 'Le registrazioni lunghe richiedono più tempo.',
        text: 'Il sito non impone alcun limite di dimensione o durata. Una lunga registrazione dello schermo richiede comunque tempo e memoria libera, e un browser più vecchio può rifiutare un file molto lungo, quindi su un telefono tagliala prima in parti.',
      },
    },
    {
      title: 'Elenca nomi e comandi.',
      text: 'Per una demo di software, inserisci nomi di prodotti, comandi e acronimi nel suggerimento di vocabolario, così vengono scritti come li scrivi tu.',
    },
  ],

  faqs: [
    {
      question:
        'Perché non riesco a riprodurre il mio WebM sul telefono, e posso comunque trascriverlo?',
      answer:
        "Alcuni telefoni e lettori più vecchi non riescono ad aprire il WebM. Qui non importa: a TranscribeVid serve solo l'audio, quindi puoi comunque aggiungere il file e ottenere una trascrizione.",
    },
    {
      question: 'Posso trascrivere un WebM solo audio?',
      answer:
        "Sì. Alcuni registratori salvano file solo audio con l'estensione .webm. Vengono letti come qualsiasi altro file audio.",
    },
    {
      question: 'Importa se il mio WebM usa VP8, VP9 o AV1?',
      answer:
        "No. L'immagine viene ignorata. Conta che il file abbia una traccia audio in un formato comune come Opus.",
    },
    {
      question: 'Come uso i sottotitoli con un WebM nella mia pagina web?',
      answer:
        "Scarica il file VTT, salvalo accanto al video e punta a esso con un elemento track dentro l'elemento video. La pagina del generatore di sottotitoli VTT mostra com'è fatto il file e il markup esatto.",
    },
    {
      question: 'Perché la mia registrazione dello schermo ha dato una trascrizione vuota?',
      answer:
        "Con ogni probabilità non contiene parlato: il microfono era spento o sono stati registrati solo i suoni di sistema. Se senti le persone parlare ma non ottieni testo, tieni attivo Migliora l'audio in Altre opzioni e prova un'impostazione di qualità più alta.",
    },
  ],

  links: [
    {
      label: 'Generatore di sottotitoli VTT',
      path: '/vtt-subtitle-generator',
      note: 'Cosa contiene un file WebVTT e come collegarlo a un video sulla tua pagina.',
    },
    {
      label: 'Come aggiungere sottotitoli a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Tutto il percorso dalla registrazione ai sottotitoli pubblicati, passo per passo.',
    },
    {
      label: 'Registrazioni di riunioni in testo',
      path: '/meeting-recording-to-text',
      note: 'Per chiamate e webinar registrati, compreso come estrarre la registrazione dallo strumento della riunione.',
    },
    {
      label: 'MP4 in testo',
      path: '/mp4-to-text',
      note: "Lo stesso servizio per l'MP4, il formato video più comune.",
    },
  ],
};
