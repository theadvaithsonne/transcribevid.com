import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: "Cos'è Whisper? Il riconoscimento vocale spiegato",
  lead: "Whisper è un modello open source di riconoscimento vocale che OpenAI ha rilasciato nel 2022. Trasforma l'audio parlato in testo in circa un centinaio di lingue e può funzionare sul tuo computer. Questa guida spiega da dove viene, da cosa ha imparato, come funziona, dove è forte e dove è debole, e come TranscribeVid lo esegue dentro il tuo browser.",
  readingMinutes: 7,
  toolPath: '/audio-to-text',
  toolCta: 'Prova Whisper sul tuo audio',
  blocks: [
    {
      title: 'Whisper in un paragrafo',
      paragraphs: [
        'Whisper è una rete neurale addestrata ad ascoltare il parlato e a scrivere ciò che sente. Gli dai un suono; ti restituisce testo con timestamp, e può anche indicare la lingua e tradurre il parlato in inglese. Esiste in diverse dimensioni, da una versione minuscola che sta su un telefono a una grande che richiede un computer potente.',
        'Non è un sito web né un servizio. È un insieme di file: il modello e il codice per eseguirlo. Chiunque può scaricarli e usarli, ed è per questo che molti strumenti di trascrizione gratuiti e privati, compreso questo, sono costruiti su di esso.',
      ],
    },
    {
      title: 'Da dove viene',
      paragraphs: [
        'OpenAI ha pubblicato Whisper nel settembre 2022, insieme a un articolo di ricerca intitolato "Robust Speech Recognition via Large-Scale Weak Supervision". Il codice e i modelli addestrati sono stati rilasciati con la licenza MIT, una delle licenze open source più permissive. Permette di usare, modificare e distribuire il software, anche in prodotti commerciali.',
        "Prima di Whisper, il miglior riconoscimento vocale era per lo più chiuso nei servizi di grandi aziende, oppure costruito per una sola lingua o per un solo tipo di audio. Whisper ha cambiato le cose essendo abbastanza buono, abbastanza ampio e gratuito da eseguire da soli. OpenAI vende anche l'accesso al riconoscimento vocale con il proprio servizio web, ma è un prodotto a pagamento separato. Il modello che esegui qui nel browser è quello aperto.",
      ],
    },
    {
      title: 'Su cosa è stato addestrato',
      paragraphs: [
        "Whisper ha imparato da circa 680.000 ore di audio abbinato a trascrizioni, raccolte da internet. Circa un terzo di quell'audio non era in inglese e copriva circa un centinaio di lingue (il rilascio ne elenca 99). Le trascrizioni non erano state tutte controllate a mano, ed è a questo che si riferisce «weak supervision» (supervisione debole) nel titolo dell'articolo.",
        "Ne derivano due conseguenze pratiche. Poiché l'audio di addestramento era così vario, con microfoni, accenti, stanze e argomenti diversi, Whisper se la cava con le registrazioni reali meglio dei modelli addestrati su parlato pulito da studio. Ma la quantità di audio di addestramento cambia da lingua a lingua, quindi la precisione è disomogenea: in generale è più alta per l'inglese e per le altre lingue molto parlate che avevano molti esempi, e più bassa per le lingue con pochi dati di addestramento.",
      ],
    },
    {
      title: 'Come funziona, in parole semplici',
      paragraphs: [
        "Whisper taglia l'audio in finestre di 30 secondi e trasforma ciascuna in un'immagine del suono, chiamata spettrogramma, che mostra quanto è forte ogni altezza di suono nel tempo. Il modello ha poi due metà. Un codificatore studia quell'immagine. Un decodificatore scrive il testo un piccolo pezzo alla volta, come potrebbe fare una persona che scrive una frase pensando a cosa viene dopo.",
        'Il decodificatore scrive anche marcatori speciali: quale lingua ritiene sia parlata, se trascrivere o tradurre, e dove inizia e finisce ogni frase nel tempo. È da qui che arrivano i timestamp.',
        "Le registrazioni lunghe vengono gestite finestra per finestra. Questo schema è flessibile, ma spiega due abitudini di Whisper: può perdere il filo tra una finestra e l'altra, e può ripetersi quando una finestra contiene poco parlato. TranscribeVid riduce entrambi i problemi con un rilevatore di voce che salta il silenzio e la maggior parte dei suoni che non sono parlato prima che il modello li veda, e con controlli che individuano in seguito una parte del testo ripetuto o inventato.",
      ],
    },
    {
      title: 'Le dimensioni del modello e quale ottieni qui',
      paragraphs: [
        "Whisper esiste in varie dimensioni. I modelli più grandi sbagliano meno, soprattutto con il rumore e nelle lingue diverse dall'inglese, ma sono più lenti e richiedono più memoria e un download più grande. Le quattro scelte di qualità nella pagina di caricamento corrispondono a queste dimensioni così:",
      ],
      table: {
        caption: 'Le dimensioni di Whisper e le scelte su TranscribeVid',
        head: ['Modello', 'Parametri (circa)', 'Dove lo trovi qui'],
        rows: [
          ['Tiny', '39 milioni', 'Altre opzioni, elenco Modello'],
          ['Base', '74 milioni', 'Più veloce'],
          ['Small', '244 milioni', 'Standard'],
          ['Medium', '769 milioni', 'Altre opzioni, elenco Modello'],
          ['Large v3 Turbo', '809 milioni', 'Alta precisione'],
          ['Large v3', '1,55 miliardi', 'Massima precisione'],
        ],
      },
      after: [
        "Large v3 è stato rilasciato nel novembre 2023, e la versione Turbo è arrivata dopo, nel 2024. Turbo è un modello grande sfoltito, molto più veloce e vicino a esso per precisione in molte lingue, ed è per questo che è la scelta Alta precisione. Un limite: OpenAI dice che Turbo non è stato addestrato per la traduzione e può restituire la lingua originale quando gli si chiede di tradurre, quindi per Risultato, Traduci in inglese scegli invece Massima precisione. L'elenco dei modelli contiene anche Distil Large v3, una versione distillata più piccola e più veloce di Whisper large v3, solo per l'inglese. In Motore di riconoscimento c'è anche Qwen3 ASR, un motore diverso e sperimentale per i browser desktop con WebGPU. Qwen3 ASR non è un modello Whisper.",
      ],
    },
    {
      title: 'Cosa fa bene',
      bullets: [
        {
          title: 'Audio del mondo reale.',
          text: 'Registrazioni del telefono, lezioni, interviste e colonne sonore di video con un rumore moderato.',
        },
        {
          title: 'Molte lingue in un solo modello.',
          text: 'La stessa famiglia di modelli gestisce inglese, spagnolo, hindi, arabo, giapponese e decine di altre, e spesso sa capire la lingua da sola.',
        },
        {
          title: 'Punteggiatura e maiuscole.',
          text: "Scrive frasi con le lettere maiuscole e la punteggiatura, invece di un'unica lunga stringa di parole minuscole.",
        },
        {
          title: 'Timestamp.',
          text: 'Ogni riga ha un tempo di inizio e di fine, e con i tempi per parola la pagina può collocare ogni parola.',
        },
        {
          title: 'Traduzione in inglese.',
          text: "Può trasformare direttamente il parlato in un'altra lingua in testo inglese, cosa che la pagina offre come Risultato, Traduci in inglese. Turbo è l'eccezione: non è stato addestrato per la traduzione, quindi per questo usa Massima precisione.",
        },
      ],
    },
    {
      title: 'Dove fa fatica',
      paragraphs: [
        'Whisper è impressionante, ed è anche fallibile. Conosci queste abitudini prima di fare affidamento su una trascrizione.',
      ],
      bullets: [
        {
          title: 'Può inventare testo.',
          text: 'Di fronte a silenzio, musica o rumore, può scrivere parole fluenti che nessuno ha detto, o ripetere una frase più e più volte. È un comportamento noto del modello, non un difetto di una singola registrazione.',
        },
        {
          title: 'Nomi, numeri e parole rare.',
          text: 'Scrive un nome nel modo che ritiene più probabile e può scambiare parole dal suono simile. Usa il suggerimento di vocabolario, poi controlla le cifre.',
        },
        {
          title: 'Lingue disomogenee.',
          text: "La precisione varia con la lingua e con l'accento. Un modello più grande aiuta molto per le lingue con meno dati di addestramento.",
        },
        {
          title: 'Nessuna etichetta dei parlanti.',
          text: 'Non dice chi sta parlando, e le voci sovrapposte spesso vengono fuse o scartate.',
        },
        {
          title: 'Non in diretta.',
          text: 'Lavora su una registrazione finestra per finestra, quindi non è fatto per didascalie che compaiono mentre qualcuno parla.',
        },
      ],
    },
    {
      title: 'Come TranscribeVid esegue Whisper nel tuo browser',
      paragraphs: [
        'Il Whisper originale è scritto per software specialistico di apprendimento automatico. Per eseguirlo in una pagina web, i modelli vengono convertiti in un formato portabile chiamato ONNX, e una libreria chiamata Transformers.js, di Hugging Face, li esegue usando ONNX Runtime. Su un computer con WebGPU il lavoro lo fa il chip grafico, ed è veloce. Altrimenti gira sul processore tramite WebAssembly, che è più lento ma funziona quasi ovunque.',
        'Per tenere i download ragionevoli, i modelli usano formati numerici compatti, che riducono i file, di solito a un piccolo costo in precisione. È così che il modello più grande pesa circa un gigabyte con WebGPU (1,8 GB con WebAssembly) invece di diversi.',
        'Su transcribevid.com, eseguire nel browser ha due conseguenze. Primo, la privacy: il tuo file multimediale viene letto sul tuo dispositivo e non caricato, quindi nessun nostro server riceve mai il tuo audio. Secondo, la velocità: dipende dal tuo dispositivo, e il primo uso di ogni livello di qualità include un download del modello una tantum. La guida alla trascrizione senza caricamento spiega cosa viene scaricato e come verificarlo.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Whisper si può usare gratuitamente?',
      answer:
        "Il modello e il suo codice sono gratuiti e open source con la licenza MIT, quindi chiunque può eseguirli. Eseguire un modello grande richiede un computer capace o un server a noleggio, e OpenAI offre anche un proprio servizio web a pagamento. Su transcribevid.com gira sul tuo dispositivo, quindi non c'è nulla da pagare.",
    },
    {
      question: 'Quante lingue capisce Whisper?',
      answer:
        "Circa un centinaio; il rilascio ne elenca 99. La qualità differisce molto tra l'una e l'altra. TranscribeVid ne offre 61 nel suo elenco Lingua, e puoi anche scegliere Rileva automaticamente.",
    },
    {
      question: 'Quale dimensione di Whisper devo scegliere?',
      answer:
        "Comincia con Standard, che è il modello Small. Passa ad Alta precisione per accenti, rumore o lingue diverse dall'inglese, e a Massima precisione quando conta ogni parola e puoi aspettare. Più veloce è solo per un parlato chiaro e tranquillo.",
    },
    {
      question: 'Perché Whisper a volte scrive parole dove nessuno parla?',
      answer:
        "Il modello è costruito per produrre sempre un testo plausibile, quindi un tratto di silenzio, musica o rumore può spingerlo a inventarne un po'. Tenere attivo Salta silenzi e musica salta la maggior parte di quei tratti prima che il modello li veda.",
    },
  ],
  links: [
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Le impostazioni e le abitudini che fanno più differenza sul risultato di Whisper.',
    },
    {
      label: 'Trascrivere un video senza caricarlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Cosa scarica il tuo browser per eseguire Whisper, e come verificare che non venga caricato nulla.',
    },
    {
      label: 'Traduci il parlato in inglese',
      path: '/translate-audio-to-english',
      note: "Usa la traduzione di Whisper per ottenere testo inglese da un parlato in un'altra lingua.",
    },
    {
      label: 'Audio in testo',
      path: '/audio-to-text',
      note: 'Inserisci una registrazione e ottieni una trascrizione con timestamp.',
    },
    {
      label: 'Audio hindi in testo (pagina in inglese)',
      path: '/hindi-audio-to-text',
      note: "Come Whisper gestisce l'hindi, compresa un'opzione Hinglish in lettere latine.",
    },
  ],
};
