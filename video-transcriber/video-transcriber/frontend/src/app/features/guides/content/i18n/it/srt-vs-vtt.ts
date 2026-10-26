import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT o VTT: quale formato di sottotitoli conviene usare?',
  lead: "SRT è la scelta sicura: quasi tutti i lettori video, gli editor e le piattaforme lo leggono. Scegli VTT (WebVTT) quando i sottotitoli sono per l'elemento video di una pagina web, o quando ti servono stile e posizionamento. Sono entrambi file di testo semplice, e da qui puoi scaricare l'uno o l'altro a partire dal tuo video.",
  readingMinutes: 8,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Crea un file SRT dal tuo video',
  blocks: [
    {
      title: 'La risposta breve',
      paragraphs: [
        'Se non sei sicuro, usa SRT. È il formato più vecchio e più semplice, ed è accettato da quasi tutti i lettori video, gli editor video e i moduli di caricamento che ti capiterà di incontrare. Un file di sottotitoli che funziona ovunque vale più di uno ingegnoso.',
        "Usa VTT quando il video viene riprodotto in una pagina web tramite l'elemento video di HTML. I browser caricano le tracce dei sottotitoli solo nel formato WebVTT, quindi un file SRT lì non funziona senza conversione. VTT è anche la scelta migliore quando vuoi collocare il testo sullo schermo, aggiungere grassetto o corsivo con sicurezza, o indicare chi sta parlando.",
        "Il resto di questa guida spiega perché, mostra come appare dentro ciascun file e ti dice come passare dall'uno all'altro senza rompere nulla.",
      ],
    },
    {
      title: 'Come appare un file SRT',
      paragraphs: [
        'SRT sta per SubRip Text, dal nome di un programma per Windows dei primi anni Duemila che copiava i sottotitoli dai DVD. Il formato non è mai stato standardizzato ufficialmente, ma è diventato così diffuso che tutto lo supporta. Un file SRT è un elenco di blocchi numerati, ciascuno separato dal successivo da una riga vuota.',
      ],
      code: {
        label: 'Un piccolo file SRT',
        text: `1
00:00:01,000 --> 00:00:03,500
Benvenuti al programma.

2
00:00:03,800 --> 00:00:07,200
Oggi vediamo come sono fatti
i file dei sottotitoli.

3
00:00:07,600 --> 00:00:10,000
Cominciamo dalle basi.`,
      },
      after: [
        'Ogni blocco ha tre parti: un numero progressivo, una riga con il tempo di inizio e il tempo di fine, e una o due righe di testo. I tempi sono scritti come ore, minuti, secondi e millisecondi, e i millisecondi sono separati da una virgola. Quella virgola è il motivo più comune per cui un file convertito a mano non funziona.',
        "Salva il file come testo semplice in UTF-8, con l'estensione .srt. UTF-8 conta non appena il testo contiene lettere accentate, devanagari, arabo o altri caratteri non inglesi.",
      ],
    },
    {
      title: 'Come appare un file WebVTT',
      paragraphs: [
        "WebVTT, di solito abbreviato in VTT, è stato progettato per il web ed è definito in una specifica pubblicata dal W3C, l'organismo che standardizza le tecnologie del web. Somiglia a SRT, ma aggiunge una riga di intestazione obbligatoria e qualche extra facoltativo.",
      ],
      code: {
        label: 'Gli stessi sottotitoli come file WebVTT',
        text: `WEBVTT

NOTE Questo file è stato creato dall'esempio SRT.

intro
00:00:01.000 --> 00:00:03.500
Benvenuti al programma.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Oggi vediamo come sono fatti
i file dei sottotitoli.

00:00:07.600 --> 00:00:10.000
<v Maria>Cominciamo dalle basi.</v>`,
      },
      after: [
        'Quattro dettagli lo distinguono. La prima riga deve essere WEBVTT. I millisecondi sono separati da un punto, non da una virgola. Un cue può avere un nome (la parola intro qui sopra) al posto del numero, o oltre a esso, e i numeri sono facoltativi. E dopo i tempi puoi aggiungere impostazioni come line, position e align, che spostano il testo sullo schermo.',
        "Puoi anche scrivere blocchi NOTE per commenti che gli spettatori non vedono mai, indicare chi parla con il tag v e usare tag semplici come b, i e u per grassetto, corsivo e sottolineato. Salva il file in UTF-8 con l'estensione .vtt.",
      ],
    },
    {
      title: 'SRT e VTT a confronto',
      paragraphs: [
        "Questa tabella mette i due formati uno accanto all'altro. Le differenze che contano nell'uso quotidiano sono l'intestazione, il separatore dei decimali e i luoghi in cui ciascun formato è accettato.",
      ],
      table: {
        caption: 'SRT a confronto con WebVTT',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['Estensione del file', '.srt', '.vtt'],
          ['Prima riga', 'Il numero 1', 'La parola WEBVTT'],
          ['Formato dei tempi', '00:00:01,000 (virgola)', '00:00:01.000 (punto)'],
          ['Numeri dei cue', 'Obbligatori', 'Facoltativi (è ammesso un nome)'],
          [
            'Posizione sullo schermo',
            'Non prevista dal formato',
            'Impostazioni del cue: line, position, align, size',
          ],
          [
            'Stile e tag dei parlanti',
            'Solo tag di base, il supporto varia da lettore a lettore',
            'Definiti nella specifica, più stile CSS',
          ],
          ['Commenti', 'Nessuno', 'Blocchi NOTE'],
          ['Elemento video di una pagina web', 'Non accettato', 'Il formato richiesto'],
          ['Specifica formale', 'Nessuna (un formato de facto)', 'Specifica del W3C'],
        ],
      },
      after: [
        'In parole semplici: SRT è il file più semplice e con la diffusione più ampia, VTT è il file più ricco con una casa più ristretta ma più moderna. Per i normali sottotitoli di un parlato, il testo sullo schermo appare uguale nei due casi.',
      ],
    },
    {
      title: 'Dove viene accettato ciascun formato',
      paragraphs: [
        'Il supporto cambia nel tempo e ogni piattaforma formula a modo suo le proprie pagine di aiuto, quindi considera questo elenco una guida e controlla la pagina di aiuto aggiornata del servizio su cui carichi il file.',
      ],
      bullets: [
        {
          title: 'Pagine web.',
          text: "L'elemento track del tag video di HTML richiede WebVTT. È l'unico caso in cui SRT non è un'opzione.",
        },
        {
          title: 'YouTube.',
          text: 'Il caricamento dei sottotitoli accetta SRT e accetta anche VTT, tra gli altri formati. SRT è la scelta abituale.',
        },
        {
          title: 'Lettori per computer e dispositivi mobili.',
          text: 'VLC e la maggior parte degli altri lettori leggono SRT, e molti leggono anche VTT. Di solito un lettore carica un file di sottotitoli che ha lo stesso nome del video.',
        },
        {
          title: 'Editor video.',
          text: "La maggior parte degli editor importa SRT come traccia di didascalie o di sottotitoli. Alcuni importano anche VTT. Se un formato viene rifiutato, prova l'altro.",
        },
        {
          title: 'Altre piattaforme social e di apprendimento.',
          text: 'Molte chiedono SRT o VTT, alcune ne chiedono uno soltanto. Leggi la pagina di caricamento prima di esportare.',
        },
      ],
    },
    {
      title: 'Convertire a mano tra SRT e VTT',
      paragraphs: [
        "Rinominare il file non basta. Un file chiamato talk.vtt che contiene ancora SRT viene rifiutato dai browser, perché manca l'intestazione e i suoi tempi usano le virgole. La conversione richiede un minuto in qualsiasi editor di testo.",
      ],
      steps: [
        {
          title: 'Da SRT a VTT, primo passo',
          text: 'Aggiungi la riga WEBVTT in cima al file, seguita da una riga vuota.',
        },
        {
          title: 'Da SRT a VTT, secondo passo',
          text: 'In ogni riga dei tempi, cambia la virgola prima dei millisecondi in un punto. Una funzione trova e sostituisci sulle righe con -->, oppure sullo schema di cifre intorno alla virgola, fa risparmiare tempo.',
        },
        {
          title: 'Da SRT a VTT, terzo passo',
          text: "Lascia i numeri dove sono, perché VTT li ammette come nomi dei cue. Salva in UTF-8 con l'estensione .vtt.",
        },
        {
          title: 'Da VTT a SRT',
          text: "Fai il contrario: elimina l'intestazione, i blocchi NOTE e le eventuali impostazioni dopo i tempi, riporta i punti a virgole, assicurati che ogni cue abbia un numero e salva come .srt.",
        },
      ],
      after: [
        'Se hai installato ffmpeg, converte anche i file di sottotitoli: ffmpeg -i talk.srt talk.vtt trasforma un file SRT in un file VTT, e lo stesso comando con i nomi invertiti fa il percorso opposto. La via più semplice, però, è scaricare il formato che ti serve dalla pagina della trascrizione, perché entrambi sono prodotti direttamente dallo stesso testo.',
      ],
    },
    {
      title: 'Problemi comuni e relative cause',
      bullets: [
        {
          title: 'Lettere accentate o non latine compaiono come simboli strani.',
          text: 'Il file non è salvato in UTF-8. Salvalo di nuovo con quella codifica.',
        },
        {
          title: 'Nella pagina web non compare nulla.',
          text: 'Il file è SRT anziché VTT, oppure il server lo invia con il tipo sbagliato. I file VTT vanno serviti come text/vtt, e un file su un altro dominio richiede anche le giuste impostazioni cross-origin.',
        },
        {
          title: 'I sottotitoli sono in ritardo o in anticipo ovunque.',
          text: "L'intero file è spostato. La maggior parte dei lettori e degli editor permette di sfasare i sottotitoli di un tempo fisso, ed è più facile che modificare ogni riga.",
        },
        {
          title: 'Due sottotitoli si sovrappongono sullo schermo.',
          text: 'Il tempo di fine di un cue è successivo al tempo di inizio del cue seguente. Accorcia il cue precedente.',
        },
        {
          title: 'Le righe sono troppo lunghe da leggere.',
          text: 'Dividile in due righe di lunghezza più o meno uguale. Circa 42 caratteri per riga è una linea guida comune.',
        },
      ],
    },
    {
      title: 'Come ottenere qui un file SRT o VTT dal tuo video',
      paragraphs: [
        'Non devi scrivere tu nessuno dei due formati. Aggiungi il tuo file video o audio nella home page, scegli la lingua parlata e lascia che la trascrizione finisca. Leggila e correggi ogni parola sbagliata: una riga modificata conserva il suo tempo di inizio e di fine, e le parole al suo interno vengono distribuite su quel tempo in proporzione alla loro lunghezza.',
        "Poi apri il menu di download e scegli SRT o VTT. Entrambi sono creati dalla stessa trascrizione modificata, quindi puoi esportarne uno per YouTube e l'altro per la tua pagina web senza ripetere alcun lavoro. Se vuoi che i sottotitoli si dividano in modo pulito sulle parole giuste, lascia attivo Tempi per parola in Altre opzioni.",
      ],
    },
  ],
  faqs: [
    {
      question: 'Posso rinominare un file SRT in VTT e usarlo sul mio sito?',
      answer:
        "No. Un browser rifiuta un file .vtt che non inizia con WEBVTT, e i tempi SRT usano le virgole dove VTT vuole i punti. Aggiungi l'intestazione, cambia le virgole, oppure scarica direttamente un file VTT dalla pagina della trascrizione.",
    },
    {
      question: 'I file SRT e VTT differiscono per dimensione o qualità?',
      answer:
        'No. Sono entrambi piccoli file di testo e nessuno dei due influisce sulla qualità del video. La differenza sta solo nelle cose in più che VTT può descrivere, come posizione sullo schermo e stile, e nei luoghi in cui ciascun formato è accettato.',
    },
    {
      question: 'I sottotitoli SRT possono essere in grassetto, in corsivo o colorati?',
      answer:
        'Alcuni lettori capiscono tag di base come b e i in SRT, ma il supporto è irregolare, quindi il risultato può cambiare da lettore a lettore. WebVTT definisce i propri tag e lo stile CSS in una specifica, il che rende il risultato più prevedibile sul web.',
    },
    {
      question: 'Quale codifica del testo deve usare un file di sottotitoli?',
      answer:
        'UTF-8. Gestisce ogni lingua ed è ciò che i browser si aspettano per WebVTT. Se i caratteri dei sottotitoli appaiono rovinati, quasi certamente il file è stato salvato con una codifica più vecchia.',
    },
  ],
  links: [
    {
      label: 'Generatore di sottotitoli SRT',
      path: '/srt-subtitle-generator',
      note: 'Inserisci un video e scarica un file SRT creato dal parlato che contiene.',
    },
    {
      label: 'Generatore di sottotitoli VTT',
      path: '/vtt-subtitle-generator',
      note: "Lo stesso, per un file WebVTT che funziona con l'elemento video di una pagina web.",
    },
    {
      label: 'Come aggiungere sottotitoli a un video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Passo per passo, dalla trascrizione a un video che mostra i sottotitoli in YouTube, VLC o in un editor.',
    },
    {
      label: 'Generatore di sottotitoli per YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Crea un file SRT per un video tuo e caricalo in YouTube Studio.',
    },
    {
      label: 'Come ottenere una trascrizione più accurata',
      path: '/guides/accurate-transcripts',
      note: 'Un testo migliore significa meno correzioni prima di esportare i sottotitoli.',
    },
  ],
};
