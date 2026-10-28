import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Come trascrivere un video in testo: cinque modi e quale si adatta al tuo video',
  lead: "Puoi ottenere le parole di un video sotto forma di testo in cinque modi: la trascrizione che YouTube ha già, la dettatura vocale, i sottotitoli di un editor video, un servizio online oppure uno strumento che gira sul tuo dispositivo. Differiscono per costo, per la presenza di un orario su ogni riga e per ciò che ti chiedono prima. Questa guida spiega cosa fa ciascuno e quando sceglierlo.",
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Trascrivi un video in testo, gratis e senza account',
  blocks: [
    {
      title: 'La risposta breve',
      bullets: [
        {
          title: 'Il video è su YouTube e ha i sottotitoli:',
          text: 'apri la sua trascrizione nella pagina del video. Non costa nulla e richiede un minuto, ma esiste solo se il video ha i sottotitoli e il testo va riletto con attenzione.',
        },
        {
          title: 'Hai il file video e vuoi il testo con gli orari:',
          text: 'usa uno strumento che accetta un file e ti restituisce TXT e file di sottotitoli. Gli ultimi due modi qui sotto lo fanno.',
        },
        {
          title: 'Ti servono solo poche citazioni:',
          text: 'riproduci il video e scrivi, oppure usa la dettatura vocale. Per qualsiasi cosa più lunga di pochi minuti è più lento che lasciar fare tutto il file a un software.',
        },
        {
          title: 'Vuoi i sottotitoli per lo stesso video:',
          text: 'scegli un modo che esporti SRT o VTT, così con una sola elaborazione ottieni sia la trascrizione sia i sottotitoli.',
        },
      ],
    },
    {
      title: 'Cosa chiede una buona trascrizione al tuo video',
      paragraphs: [
        "Tutti i modi qui sotto lavorano sulla traccia audio, quindi la qualità del suono decide la qualità del testo molto più dell'immagine. Un parlato vicino al microfono, una voce alla volta, senza musica sotto, viene bene. Una stanza con eco, persone che si sovrappongono o un forte rumore di fondo producono errori con qualsiasi metodo.",
        "Prima di iniziare, chiarisci tre cose: la lingua parlata nel video, se ti serve un orario su ogni riga e quanto è lungo il video. La seconda ti dice quali formati devi poter scaricare; la terza ti dice quali limiti gratuiti ti fermeranno.",
      ],
    },
    {
      title: 'Modo 1: usa la trascrizione che YouTube ha già',
      paragraphs: [
        "Molti video di YouTube hanno i sottotitoli, scritti dal proprietario o generati automaticamente. Nella pagina di un video, apri la descrizione: dove i sottotitoli esistono compare un'opzione per mostrare la trascrizione, che elenca il testo con gli orari e puoi copiarla. Se il video è tuo, YouTube Studio ha una sezione Sottotitoli dove puoi rivedere e scaricare i sottotitoli. YouTube modifica queste schermate di tanto in tanto, quindi le etichette potrebbero essere un po' diverse.",
      ],
      after: [
        "È il modo più rapido per un video che è già su YouTube. I suoi limiti sono che funziona solo con il link di un video che ha i sottotitoli, che il testo automatico può essere approssimativo su nomi e termini tecnici e che non aiuta con un file sul computer o sul telefono.",
      ],
    },
    {
      title: 'Modo 2: riproduci il video e lascia ascoltare la dettatura vocale',
      paragraphs: [
        'La dettatura vocale di un programma di videoscrittura, come l\'opzione Digitazione vocale nel menu Strumenti di Google Docs, scrive ciò che sente il suo microfono. Tu riproduci il video dagli altoparlanti e lei scrive.',
        "Non costa nulla, ma sente tutta la stanza, non solo il video. Non dà alcun orario, funziona in tempo reale, quindi un video di un'ora richiede un'ora, e tutto ciò che il microfono non coglie va perso. Va bene per una o due citazioni ed è una scelta povera per una lezione o un'intervista.",
      ],
    },
    {
      title: 'Modo 3: attiva i sottotitoli automatici in un editor video',
      paragraphs: [
        "Alcuni editor video possono trascrivere il parlato di una clip che ci inserisci. La guida di Microsoft Clipchamp, per esempio, dice di aprire la scheda Sottotitoli, attivare i sottotitoli automatici e poi scaricarli come file SRT; perché funzioni, il video deve avere del parlato nell'audio.",
        "È utile quando stai comunque montando il video, perché i sottotitoli finiscono sulla linea temporale. Per una semplice trascrizione è più lavoro del necessario: devi caricare il video nell'editor e il testo esce come file di sottotitoli che poi devi trasformare in un documento.",
      ],
    },
    {
      title: 'Modo 4: usa un servizio di trascrizione online',
      paragraphs: [
        "Decine di siti trascrivono un file che dai loro. La maggior parte è gratuita solo fino a un certo punto: pochi minuti, pochi file, o un'anteprima che chiede di pagare prima di poter scaricare. Le differenze che contano sono se serve un account, quanti minuti ottieni, quanto può essere grande un file e se il risultato si può esportare.",
        'I servizi sono la scelta giusta quando ti serve ciò che gli strumenti semplici non fanno: i nomi di ciascun interlocutore, un bot che entra in una riunione o il link a un video che non hai come file. Qui sotto trovi il link alla nostra guida con i limiti gratuiti di tredici di essi, ciascuno citato dalla propria pagina.',
      ],
    },
    {
      title: 'Modo 5: trascrivi il file con TranscribeVid',
      paragraphs: [
        'TranscribeVid accetta il file video vero e proprio, senza account e senza conteggio giornaliero. Esegue Whisper, un modello vocale aperto, e restituisce il testo con un orario su ogni riga.',
        'Non accetta link, non indica chi sta parlando e non entra nelle riunioni. Per questi compiti usa un servizio del Modo 4.',
      ],
      browser: {
        paragraphs: [
          'TranscribeVid accetta il file video vero e proprio, senza account, senza conteggio giornaliero e senza limite di dimensione. Esegue Whisper, un modello vocale aperto, nel tuo browser, quindi il video resta sul tuo dispositivo, e il testo torna con un orario su ogni riga.',
          'Non accetta link, non indica chi sta parlando e non entra nelle riunioni. Per questi compiti usa un servizio del Modo 4. Poiché il lavoro lo fa il tuo dispositivo, un video lungo è più lento su un vecchio telefono che su un portatile recente.',
        ],
      },
      steps: [
        { title: 'Aggiungi il video', text: 'Trascina il file nel riquadro della pagina dello strumento oppure premi Scegli un file. MP4, MOV, MKV, WEBM e la maggior parte degli altri file video funzionano, e così anche i file audio.' },
        { title: 'Scegli lingua e qualità', text: "Indica la lingua parlata se la conosci. Standard va bene per la maggior parte dei video; scegli Alta precisione o Massima precisione per accenti, rumore o l'hindi." },
        { title: 'Attendi il testo', text: 'Le righe compaiono una alla volta, con una barra di avanzamento e il tempo rimanente.' },
        { title: 'Modifica e scarica', text: "Correggi qualsiasi riga nell'editor, poi scarica TXT, SRT, VTT, PDF, Markdown o JSON. Scarica ciò che vuoi conservare prima di andare via." },
      ],
    },
    {
      title: 'Quale modo per quale video',
      table: {
        caption: 'I cinque modi a confronto, come descritti in questa guida',
        head: ['Modo', 'Costo', 'Orari su ogni riga', 'Funziona su', 'Ideale per'],
        rows: [
          ['Trascrizione di YouTube', 'Gratis', 'Sì', 'Un video di YouTube con sottotitoli', 'Una copia rapida da un video già online'],
          ['Dettatura vocale', 'Gratis', 'No', 'Qualsiasi cosa si possa riprodurre ad alta voce', 'Poche citazioni'],
          ['Sottotitoli dell\'editor', "Dipende dall'editor", 'Sì, come sottotitoli', "Una clip caricata nell'editor", 'Un video che stai comunque montando'],
          ['Servizio online', 'Gratis fino a un limite, poi a pagamento', 'Di solito', 'File e, a volte, link', 'Nomi degli interlocutori, riunioni, link'],
          ['TranscribeVid', 'Gratis', 'Sì', 'Un file video o audio', 'Un file, con TXT e sottotitoli in cambio'],
        ],
      },
    },
    {
      title: 'Correggi il testo prima di usarlo',
      paragraphs: [
        'Qualunque modo scegli, leggi il risultato una volta mentre il video è in riproduzione. Il riconoscimento vocale azzecca le parole comuni e inciampa proprio su ciò che conta di più per te: nomi, termini di prodotto, numeri e tutto ciò che viene detto in fretta.',
      ],
      bullets: [
        { title: 'Nomi e termini.', text: 'Cerca nel testo ciascun nome che sai essere nel video e correggi ogni punto in cui compare.' },
        { title: 'Numeri e date.', text: 'Controlla ognuno con il video; una cifra sbagliata è facile da non notare.' },
        { title: 'Dove cambia chi parla.', text: 'Aggiungi un a capo e un nome, perché le trascrizioni semplici non indicano chi sta parlando.' },
        { title: 'Sottotitoli.', text: 'Se userai un file SRT o VTT, mantieni ogni riga abbastanza breve da poter essere letta nel tempo in cui resta sullo schermo.' },
      ],
      after: [
        "Per un elenco più lungo di abitudini che riducono gli errori prima di iniziare, vedi la guida su come ottenere una trascrizione più accurata.",
      ],
    },
  ],
  faqs: [
    {
      question: 'Posso trascrivere un video in testo senza installare nulla?',
      answer: 'Sì. La trascrizione di YouTube, un servizio online e TranscribeVid funzionano tutti in un browser web. Solo un editor video o un programma desktop richiede un\'installazione.',
    },
    {
      question: "Qual è il modo più veloce per trascrivere un video di un'ora?",
      answer: "Se è su YouTube con i sottotitoli, la trascrizione lì è immediata. Per un file, un software è molto più veloce che scrivere o usare la dettatura vocale, che richiedono entrambe almeno quanto dura il video. Il tempo di un software dipende dallo strumento, dal livello di qualità e, quando gira sul tuo dispositivo, da quanto è veloce quel dispositivo.",
    },
    {
      question: "Devo prima estrarre l'audio dal video?",
      answer: "No. Gli strumenti che accettano file video leggono da soli la traccia audio, quindi puoi aggiungere un MP4 o un MOV così com'è. Estrarre prima l'audio serve solo quando uno strumento rifiuta il formato del video.",
    },
    {
      question: 'Come ottengo il testo con un orario su ogni riga?',
      answer: 'Usa un modo che esporti i sottotitoli o una trascrizione con gli orari: la trascrizione di YouTube elenca gli orari e uno strumento che scarica SRT o VTT dà a ogni riga un orario di inizio e di fine. La dettatura vocale non ne dà.',
    },
  ],
  links: [
    {
      label: 'Strumenti gratuiti da video a testo a confronto',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'I limiti gratuiti di tredici strumenti online, ciascuno citato dalla propria pagina.',
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Abitudini e impostazioni che riducono gli errori su qualsiasi video.',
    },
    {
      label: 'Crea i sottotitoli per il tuo video',
      path: '/srt-subtitle-generator',
      note: 'Trasforma lo stesso video in un file SRT per lettori ed editor.',
    },
    {
      label: 'Trascrivere un video senza caricarlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Come il lavoro resta sul tuo dispositivo e come verificarlo da solo.',
    },
  ],
};
