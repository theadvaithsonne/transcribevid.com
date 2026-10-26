import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Come aggiungere sottotitoli a un video, gratis',
  lead: "Creare i sottotitoli richiede quattro passi: trasformare il parlato in testo, correggere gli errori, esportare un file SRT o VTT e collegare quel file al video. Questa guida percorre ogni passo e mostra come collegare il file in YouTube, in VLC, in un editor video, in una pagina web o in modo permanente nell'immagine con ffmpeg.",
  readingMinutes: 8,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Crea i sottotitoli dal tuo video',
  blocks: [
    {
      title: "Prima decidi: sottotitoli separati o sottotitoli incorporati nell'immagine",
      paragraphs: [
        'Ci sono due modi per mettere i sottotitoli su un video, e la scelta decide quali passi ti servono.',
      ],
      bullets: [
        {
          title: 'Sottotitoli separati (una traccia a parte).',
          text: 'I sottotitoli sono un file o una traccia accanto al video. Gli spettatori possono attivarli e disattivarli, scegliere una lingua, e tu puoi correggere un errore di battitura più tardi senza toccare il video. È così che funzionano YouTube, VLC, la maggior parte dei lettori e delle pagine web. Serve un lettore che supporti le tracce dei sottotitoli.',
        },
        {
          title: "Sottotitoli incorporati (parte dell'immagine).",
          text: 'Il testo è disegnato su ogni fotogramma, quindi si vede ovunque, comprese le piattaforme che non accettano alcun file di sottotitoli. Il prezzo è che nessuno può disattivarlo, non puoi correggerlo senza esportare di nuovo il video e il video va ricodificato.',
        },
      ],
      after: [
        'Nel dubbio, comincia con i sottotitoli separati. Incorporali solo quando il posto in cui pubblichi non permette di caricare i sottotitoli.',
      ],
    },
    {
      title: 'I quattro passi in sintesi',
      steps: [
        {
          title: 'Trascrivi il video',
          text: 'Aggiungi il video nella home page, scegli la lingua parlata e lascia che il parlato diventi testo con i tempi.',
        },
        {
          title: 'Correggi il testo',
          text: 'Leggi la trascrizione e correggi nomi, numeri e parole poco chiare. Se le righe dei sottotitoli escono troppo lunghe, scegli una Lunghezza delle righe dei sottotitoli più corta nel menu Esporta.',
        },
        {
          title: 'Esporta SRT o VTT',
          text: "Scarica il file dei sottotitoli. SRT funziona quasi ovunque. VTT è per l'elemento video di una pagina web.",
        },
        {
          title: 'Collega il file',
          text: 'Caricalo su YouTube, aprilo nel tuo lettore o editor, oppure aggiungilo alla tua pagina. Oppure incorporalo nel video.',
        },
      ],
    },
    {
      title: 'Passi 1 e 2: trascrivi il video e correggi il testo',
      paragraphs: [
        'Scegli il video nella home page e seleziona la lingua in cui si parla, invece di lasciare il rilevamento automatico. Indicare la lingua è più affidabile, soprattutto per clip brevi e con accenti. La qualità Standard va bene per la maggior parte dei video. Scegli Alta precisione per un audio rumoroso o con forti accenti.',
        "Tieni attivo Tempi per parola in Altre opzioni. È attivo per impostazione predefinita e fa sì che ogni sottotitolo inizi e finisca con le parole, invece che ai margini di un lungo blocco. Quando la trascrizione è pronta, riproduci il video accanto a essa e leggi seguendo. Le parole di cui il riconoscitore era meno sicuro sono sottolineate finché l'opzione Sottolinea le parole incerte è attiva (lo è per impostazione predefinita), quindi controlla prima quelle.",
        'I sottotitoli si leggono in fretta, quindi dai al testo la forma giusta per chi guarda. Sono linee guida molto diffuse, non regole rigide:',
      ],
      bullets: [
        {
          title: 'Lunghezza delle righe.',
          text: 'Circa 42 caratteri per riga e al massimo due righe alla volta. Il menu Esporta ha una scelta Lunghezza delle righe dei sottotitoli: Corta (32 caratteri), Standard (42) o Lunga (56).',
        },
        {
          title: 'Tempo sullo schermo.',
          text: 'Ogni sottotitolo dovrebbe restare visibile per almeno un secondo circa e raramente più di sette.',
        },
        {
          title: 'Velocità di lettura.',
          text: 'Da 15 a 20 caratteri al secondo circa sono comodi per la maggior parte degli adulti. Se le persone non fanno in tempo a finire di leggere prima che la riga cambi, accorcia la formulazione o lascia la riga più a lungo.',
        },
        {
          title: 'Interruzioni naturali.',
          text: "Un buon sottotitolo si interrompe alla fine di una frase, non a metà di un nome né tra un articolo e il suo sostantivo. L'esportazione manda a capo le righe lunghe al posto tuo, quindi tieni ogni riga modificata come una frase completa.",
        },
      ],
    },
    {
      title: 'Passo 3: scegli SRT o VTT',
      paragraphs: [
        'Scarica SRT a meno che i sottotitoli siano per un video sulla tua pagina web. YouTube, VLC e quasi ogni editor accettano SRT. Una pagina web richiede VTT, perché i browser leggono le tracce dei sottotitoli solo in quel formato.',
        "Puoi scaricare entrambi dalla stessa trascrizione, quindi non serve decidere in anticipo. La guida a SRT e VTT spiega le differenze esatte, compreso cosa c'è dentro ciascun file.",
      ],
    },
    {
      title: 'Passo 4: aggiungi il file a YouTube, VLC o a un editor',
      paragraphs: [
        "I nomi dei menu cambiano ogni tanto, quindi cerca la voce più simile se un'etichetta è diversa da quella qui sotto.",
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: "Apri YouTube Studio, scegli il video, apri Sottotitoli, aggiungi una lingua, poi scegli di caricare un file. Scegli l'opzione per un file con la temporizzazione, seleziona il tuo SRT e pubblica. YouTube ti permette di modificare le righe in seguito nella stessa schermata.",
        },
        {
          title: 'VLC.',
          text: "Riproduci il video, poi scegli Sottotitoli, Aggiungi file sottotitoli dal menu e seleziona il tuo SRT. Puoi anche trascinare il file sulla finestra del lettore. Oppure salva l'SRT accanto al video con lo stesso nome (lezione.mp4 e lezione.srt) e VLC di solito lo carica da solo.",
        },
        {
          title: 'Editor video.',
          text: "La maggior parte degli editor può importare un file SRT come traccia di didascalie o di sottotitoli, da un menu come File, Importa, oppure dal pannello delle didascalie. Una volta sulla timeline puoi cambiare lo stile del testo. Se un formato viene rifiutato, prova l'altro.",
        },
        {
          title: 'Telefoni e tablet.',
          text: "Un'app di lettura video che supporta i file di sottotitoli, come VLC per dispositivi mobili, può caricare un file SRT dai tuoi file. Il lettore della galleria integrato in molti telefoni non può.",
        },
      ],
    },
    {
      title: "Aggiungere i sottotitoli a una pagina web con l'elemento track",
      paragraphs: [
        "Sul tuo sito web l'elemento video di HTML carica i sottotitoli tramite un elemento track che punta a un file WebVTT. Esporta il VTT, caricalo accanto al video e aggiungi una riga.",
      ],
      code: {
        label: 'Un video con una traccia di sottotitoli',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.it.vtt"
         srclang="it" label="Italiano" default>
</video>`,
      },
      after: [
        "L'attributo default mostra la traccia senza che lo spettatore la scelga. Aggiungi una riga track per ogni lingua. Se il file VTT si trova su un dominio diverso da quello della pagina, quel server deve consentire le richieste cross-origin, altrimenti il browser non lo carica.",
      ],
    },
    {
      title: 'Aggiungere una traccia di sottotitoli separata a un MP4 con ffmpeg',
      paragraphs: [
        'ffmpeg è uno strumento gratuito da riga di comando che può inserire i sottotitoli dentro il file MP4, così il video e i suoi sottotitoli viaggiano come un unico file. Video e audio vengono copiati senza modifiche, quindi è veloce e non perde qualità. Metti il video e il file SRT in una sola cartella ed esegui lì questo comando.',
      ],
      code: {
        label: 'Sottotitoli separati dentro un MP4 (gli spettatori possono disattivarli)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=ita talk-subtitled.mp4`,
      },
      after: [
        "Le opzioni -map scelgono con precisione cosa entra nel nuovo file: tutto il video, l'eventuale audio (il punto interrogativo fa proseguire il comando se non ce n'è) e il file dei sottotitoli. Scegliere a mano i flussi evita errori con i file di telefoni e fotocamere che contengono anche tracce di dati aggiuntive, che MP4 spesso non può copiare. L'impostazione mov_text è il tipo di sottotitoli usato dai file MP4. Il codice della lingua è di tre lettere: eng per l'inglese, spa per lo spagnolo, hin per l'hindi, ita per l'italiano e così via. Lettori come VLC mostrano la traccia nel loro menu dei sottotitoli.",
      ],
    },
    {
      title: "Incorporare i sottotitoli nell'immagine con ffmpeg",
      paragraphs: [
        "Per una piattaforma che accetta solo un video, disegna il testo su ogni fotogramma. Il video viene ricodificato, quindi ci vuole più tempo e il file viene creato di nuovo. L'audio viene copiato così com'è. Eseguilo nella cartella che contiene entrambi i file, così eviti problemi con i percorsi dei file.",
      ],
      code: {
        label: 'Sottotitoli incorporati (permanenti, non si possono disattivare)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "Per cambiare l'aspetto, aggiungi uno stile dopo il nome del file, per esempio subtitles=talk.srt:force_style='FontSize=22' dentro le virgolette del comando. Conserva una copia del video originale, perché una versione con i sottotitoli incorporati non può essere riportata a sottotitoli separati.",
      ],
    },
    {
      title: 'Accessibilità, e perché devi controllare il testo',
      paragraphs: [
        "I sottotitoli aiutano le persone sorde o con problemi di udito, chi guarda in treno o in un ufficio silenzioso con l'audio spento, chi sta ancora imparando la lingua e chiunque trovi più facile seguire le parole scritte. Molti spettatori li attivano anche quando potrebbero sentire l'audio.",
        'Il riconoscimento vocale è buono, ma non è perfetto, e un sottotitolo con un nome o un numero sbagliato può trarre in inganno. Leggi sempre la trascrizione confrontandola con il video prima di pubblicarla e fai particolare attenzione a nomi, cifre, termini tecnici e a tutto ciò che è legale o medico. Sottotitoli che descrivono anche i suoni importanti, come una risata o una porta che si chiude, sono più utili a chi non può sentirli, e puoi aggiungerli a mano mentre modifichi.',
      ],
    },
  ],
  faqs: [
    {
      question: "Che differenza c'è tra sottotitoli e didascalie?",
      answer:
        'I sottotitoli traducono o scrivono il parlato per gli spettatori che possono sentire il video. Le didascalie descrivono anche i suoni, come la musica o le risate, per gli spettatori che non possono sentire. I file sono dello stesso tipo, quindi puoi aggiungere tu le descrizioni dei suoni a un file SRT se vuoi le didascalie.',
    },
    {
      question: 'Mi serve un software speciale per aggiungere i sottotitoli?',
      answer:
        "No. Carica il file SRT in YouTube Studio, trascinalo su VLC o importalo nel tuo editor. Solo inserire il file in un MP4, o incorporare il testo nell'immagine, richiede uno strumento come ffmpeg o un editor video capace di esportarlo.",
    },
    {
      question: 'Posso aggiungere sottotitoli in più di una lingua?',
      answer:
        'Sì, con i sottotitoli separati. Crea un file per ogni lingua e aggiungi ciascuno come traccia a sé. Questo sito può scrivere la trascrizione nella lingua parlata e può tradurre il parlato in inglese, ma il testo nelle altre lingue dovresti tradurlo tu o con un altro strumento.',
    },
    {
      question: 'Perché i miei sottotitoli non sono sincronizzati con il video?',
      answer:
        "O l'intero file è spostato, e la maggior parte dei lettori può correggerlo con un'impostazione di ritardo dei sottotitoli, oppure il video è stato montato dopo la creazione dei sottotitoli. I sottotitoli seguono il tempo dell'audio da cui sono stati creati, quindi trascrivi la versione finale del video.",
    },
  ],
  links: [
    {
      label: 'Generatore di sottotitoli SRT',
      path: '/srt-subtitle-generator',
      note: 'Parti da qui per trasformare un video in un file SRT.',
    },
    {
      label: 'SRT o VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Cosa contiene ciascun file e quale scaricare nel tuo caso.',
    },
    {
      label: 'Generatore di sottotitoli VTT',
      path: '/vtt-subtitle-generator',
      note: "Ottieni il file WebVTT che serve all'elemento video di una pagina web.",
    },
    {
      label: 'Generatore di sottotitoli per YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Il percorso specifico per YouTube, dal file al caricamento in Studio.',
    },
    {
      label: 'Traduci il parlato in inglese',
      path: '/translate-audio-to-english',
      note: "Ottieni sottotitoli in inglese da un video parlato in un'altra lingua.",
    },
  ],
};
